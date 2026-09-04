#!/usr/bin/env python3
"""
Translates the English dictionary into the Eighth Schedule languages with
IndicTrans2 (https://github.com/AI4Bharat/IndicTrans2), writing the same
lib/i18n/generated/<code>.json files the Bhashini backend produces.

    python3 scripts/translate_indictrans2.py              # locales with no file yet
    python3 scripts/translate_indictrans2.py ta te         # just these
    python3 scripts/translate_indictrans2.py --force       # redo existing
    python3 scripts/translate_indictrans2.py --dry         # no model, no download
    python3 scripts/translate_indictrans2.py --model dist  # smaller/faster model

WHY THIS EXISTS ALONGSIDE THE BHASHINI SCRIPT
IndicTrans2 is a model, not a service: MIT-licensed, run locally, no API key, no
rate limit, and none of Bhashini's proof-of-concept restriction. It covers all 22
scheduled languages including the ones Bhashini has no public model for, and it
handles the multi-script languages explicitly through FLORES-200 tags.

The two backends share their string-selection rules (scripts/lib/strings.ts), so
whichever you run, the same strings get translated and the same ones — the brand
name, the Hinglish quote, video ids — are left alone.

SETUP
    python3 -m venv .venv && source .venv/bin/activate
    pip install -r scripts/requirements-indictrans2.txt

The models are MIT-licensed but the HuggingFace repos are GATED, so a download
needs an account and an accepted access request:
    1. Sign in at https://huggingface.co and open
       https://huggingface.co/ai4bharat/indictrans2-en-indic-1B (and the
       -dist-200M repo if you plan to use --model dist). Accept the terms —
       approval is usually immediate.
    2. Create a READ token at https://huggingface.co/settings/tokens
    3. Put it in .env.local as HF_TOKEN=hf_...   (or run `huggingface-cli login`)

First run downloads the model (~4.5GB for 1B, ~1GB for dist). If you would rather
not set up a local Python toolchain, run this same script in a Colab notebook and
copy the resulting JSON into lib/i18n/generated/.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STRINGS_FILE = ROOT / "scripts" / ".cache" / "strings.json"
OUT_DIR = ROOT / "lib" / "i18n" / "generated"

MODELS = {
    "base": "ai4bharat/indictrans2-en-indic-1B",
    "dist": "ai4bharat/indictrans2-en-indic-dist-200M",
}


# ── The dictionary comes from TypeScript ────────────────────────────────────
# lib/dictionaries.ts is TypeScript, so rather than re-implement the walk here
# (and let the two backends drift on which strings they skip), we run the shared
# exporter and read its output.

def load_env_local() -> None:
    """Reads HF_TOKEN out of .env.local so the token lives in the same gitignored
    file as the project's other secrets, rather than in the shell profile."""
    env = ROOT / ".env.local"
    if not env.exists():
        return
    for line in env.read_text(encoding="utf-8").splitlines():
        m = re.match(r"\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$", line)
        if m and m.group(1) not in os.environ:
            os.environ[m.group(1)] = m.group(2).strip("\"'")
    # huggingface_hub reads HF_TOKEN; accept the older name too.
    if "HF_TOKEN" not in os.environ and "HUGGINGFACE_TOKEN" in os.environ:
        os.environ["HF_TOKEN"] = os.environ["HUGGINGFACE_TOKEN"]


def load_strings(refresh: bool = True) -> dict:
    if refresh or not STRINGS_FILE.exists():
        print("Exporting strings from the dictionary…")
        subprocess.run(
            ["npx", "tsx", "scripts/export-strings.ts"],
            cwd=ROOT,
            check=True,
        )
    return json.loads(STRINGS_FILE.read_text(encoding="utf-8"))


# Mirrors normalize() in scripts/lib/strings.ts — keep the two in step.
# MT ends fragments with a full stop the source never had: "Home" comes back as
# "வீடு.", "Contact" as "যোগাযোগ করুন।". On a nav item that mark is just wrong.
TRAILING = re.compile(r"[.!?।॥۔\s]+$")


def normalize(source: str, translated: str) -> str:
    out = translated.strip()
    if TRAILING.search(source.strip()):
        return out
    return TRAILING.sub("", out)


def scatter(paths: list[str], values: list[str]) -> dict:
    """Rebuilds the dictionary shape from dot-paths. Mirrors scatter() in
    scripts/lib/strings.ts — 'home.pillars.0.title' becomes nested objects with
    an array at 'pillars'."""
    out: dict = {}
    for path, value in zip(paths, values):
        parts = path.split(".")
        cursor = out
        for i, part in enumerate(parts):
            if i == len(parts) - 1:
                if isinstance(cursor, list):
                    while len(cursor) <= int(part):
                        cursor.append(None)
                    cursor[int(part)] = value
                else:
                    cursor[part] = value
                break
            next_is_index = re.fullmatch(r"\d+", parts[i + 1]) is not None
            empty = [] if next_is_index else {}
            if isinstance(cursor, list):
                idx = int(part)
                while len(cursor) <= idx:
                    cursor.append(None)
                if cursor[idx] is None:
                    cursor[idx] = empty
                cursor = cursor[idx]
            else:
                if part not in cursor or cursor[part] is None:
                    cursor[part] = empty
                cursor = cursor[part]
    return out


# ── Translation ─────────────────────────────────────────────────────────────

class Translator:
    """Wraps IndicTrans2. Loaded once and reused across every target language —
    the en→indic model is multilingual, so the target is a tag, not a reload."""

    def __init__(self, model_key: str, device: str | None, beams: int = 5):
        import torch
        from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
        from IndicTransToolkit.processor import IndicProcessor

        name = MODELS[model_key]
        if device is None:
            device = (
                "cuda" if torch.cuda.is_available()
                else "mps" if torch.backends.mps.is_available()
                else "cpu"
            )
        print(f"Loading {name} on {device} (first run downloads the weights)…")
        if not os.environ.get("HF_TOKEN"):
            print(
                "  note: no HF_TOKEN set — these repos are gated, so the download "
                "will 401 unless you have already run `huggingface-cli login`.",
            )

        self.torch = torch
        self.device = device
        # Beam search stalls indefinitely on Apple's MPS backend with this model —
        # individual batches that take ~2s greedily never return with beams=5.
        # CPU and CUDA are unaffected, so only MPS gets forced down to greedy.
        if device == "mps" and beams > 1:
            print(
                f"  note: MPS backend — using greedy decoding instead of "
                f"num_beams={beams}, which hangs here. Pass --device cpu for "
                f"beam search (slower per token, but no stall).",
            )
            beams = 1
        self.beams = beams
        self.tokenizer = AutoTokenizer.from_pretrained(name, trust_remote_code=True)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(
            name, trust_remote_code=True
        ).to(device).eval()
        self.processor = IndicProcessor(inference=True)

    def translate(self, texts: list[str], tgt: str, budget: int) -> list[str]:
        """Translates every string, returned in the original order.

        Batches are formed by LENGTH, not by position. padding="longest" pads a
        batch to its longest member, so mixing a 300-character paragraph in with
        twenty nav labels makes the model generate at full width for all of them.
        Measured on this dictionary: a positional batch of 25 never finished in
        nine minutes, while length-matched batches of 16 took 2.6 seconds.

        So: sort by length, fill each batch up to a token budget
        (rows x width <= budget), translate, then restore the caller's order.
        """
        # Two caps, because each blows up separately on MPS: a wide batch (one
        # long paragraph padding out twenty short labels) and a tall one (200
        # two-word labels in a single generate call) both stall. Measured sweet
        # spot on this dictionary is <=16 rows of similar length.
        max_rows = 16
        order = sorted(range(len(texts)), key=lambda i: len(texts[i]))
        out: list[str | None] = [None] * len(texts)

        batch: list[int] = []
        widest = 0
        batches: list[list[int]] = []
        for i in order:
            width = max(widest, len(texts[i]))
            if batch and (
                len(batch) >= max_rows or width * (len(batch) + 1) > budget
            ):
                batches.append(batch)
                batch, widest = [i], len(texts[i])
            else:
                batch.append(i)
                widest = width
        if batch:
            batches.append(batch)

        print(f"{len(batches)} batches", end="", flush=True)
        for n, group in enumerate(batches, 1):
            started = time.time()
            chunk = [texts[i] for i in group]
            prepared = self.processor.preprocess_batch(
                chunk, src_lang="eng_Latn", tgt_lang=tgt
            )
            enc = self.tokenizer(
                prepared, truncation=True, padding="longest", return_tensors="pt"
            ).to(self.device)
            with self.torch.no_grad():
                generated = self.model.generate(
                    **enc, num_beams=self.beams, max_length=256, min_length=0
                )
            decoded = self.tokenizer.batch_decode(
                generated, skip_special_tokens=True, clean_up_tokenization_spaces=True
            )
            for i, text in zip(group, self.processor.postprocess_batch(decoded, lang=tgt)):
                out[i] = text
            print(
                f"\n    {n}/{len(batches)}  {len(group):2d} rows  "
                f"{enc['input_ids'].shape[1]:3d} wide  {time.time() - started:5.1f}s",
                end="",
                flush=True,
            )

        return [t if t is not None else texts[i] for i, t in enumerate(out)]


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("locales", nargs="*", help="locale codes; default = all untranslated")
    ap.add_argument("--force", action="store_true", help="redo locales already written")
    ap.add_argument("--dry", action="store_true", help="no model — writes «marked» English")
    ap.add_argument("--model", choices=MODELS, default="base")
    ap.add_argument(
        "--budget",
        type=int,
        default=400,
        help="max rows x padded-width per batch (lower if generation stalls)",
    )
    ap.add_argument("--beams", type=int, default=5, help="1 = fastest, 5 = best")
    ap.add_argument("--device", default=None, help="cuda | mps | cpu (default: auto)")
    args = ap.parse_args()

    load_env_local()
    data = load_strings()
    paths, texts = data["paths"], data["texts"]
    by_code = {loc["code"]: loc for loc in data["locales"]}

    # English is the source; Hindi is hand-written in lib/dictionaries.ts and is
    # never machine-overwritten.
    candidates = [c for c in by_code if c not in ("en", "hi")]
    targets = args.locales or candidates

    unknown = [c for c in targets if c not in by_code]
    if unknown:
        print(f"Unknown locale(s): {', '.join(unknown)}", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    if not (args.force or args.dry):
        targets = [c for c in targets if not (OUT_DIR / f"{c}.json").exists()]

    print(f"\n{len(texts)} translatable strings → {len(targets)} locale(s)\n")
    if not targets:
        print("Nothing to do — pass --force to redo existing locales.\n")
        return 0

    try:
        translator = None if args.dry else Translator(args.model, args.device, args.beams)
    except OSError as err:
        if "gated repo" in str(err) or "401" in str(err):
            print(
                f"\nHuggingFace refused the download: {MODELS[args.model]} is a "
                "gated repo.\n"
                "  1. Accept the terms at "
                f"https://huggingface.co/{MODELS[args.model]}\n"
                "  2. Make a read token at https://huggingface.co/settings/tokens\n"
                "  3. Add HF_TOKEN=hf_... to .env.local, then re-run.\n",
                file=sys.stderr,
            )
            return 1
        raise

    failed: list[str] = []
    for code in targets:
        meta = by_code[code]
        print(f"  {meta['english']} ({code}) ", end="", flush=True)
        try:
            if args.dry:
                values = [f"«{t}»" for t in texts]
            else:
                values = [
                    normalize(src, out)
                    for src, out in zip(
                        texts, translator.translate(texts, meta["flores"], args.budget)
                    )
                ]
            (OUT_DIR / f"{code}.json").write_text(
                json.dumps(scatter(paths, values), ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
            print(f" ✓ {len(values)} strings")
        except Exception as err:  # one bad language must not lose the rest
            failed.append(code)
            print(f" ✗ {err}")

    subprocess.run(["npx", "tsx", "scripts/refresh-barrel.ts"], cwd=ROOT, check=True)

    if failed:
        print(f"\nFailed: {', '.join(failed)} — these fall back to English until re-run.")
    print(
        "\nReview the output before shipping. Corrections go in "
        "lib/i18n/overrides/<code>.json, which is never overwritten.\n"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
