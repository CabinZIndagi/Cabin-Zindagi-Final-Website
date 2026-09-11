"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { display } from "@/lib/fonts";
import {
  musicPlaylists,
  MUSIC_CATEGORIES,
  type MusicCategory,
  type MusicPlaylist,
} from "@/data/music";
import type { PlaylistTracks } from "@/lib/youtube";

/**
 * The Music service on the driver hub: a grid of YouTube playlists with one
 * embedded player above it.
 *
 * The player is a facade until it is asked for. Nothing loads the iframe on
 * arrival — the page shows the playlist artwork and a play button, and only
 * mounts YouTube's embed once a driver taps one. That is deliberate: this page
 * is opened on a phone on a mobile pack at the roadside, and an autoloading
 * embed would start spending a driver's data before they had chosen anything.
 *
 * `tracks` is the song list for each playlist, read server-side from the
 * YouTube Data API. It is optional by design — without a `YOUTUBE_API_KEY` the
 * page gets `{}`, the song list is not rendered, and the player works exactly
 * as it did before, with YouTube's own next/prev as the only way through a
 * playlist.
 */

/** Brand-tinted card art for a playlist with no `cover` video. */
const TINTS = [
  "from-brand/45 to-brand-dark/25",
  "from-accent/45 to-accent-dark/25",
  "from-brand-light/45 to-brand/25",
  "from-accent-light/45 to-accent/25",
];

function embedSrc(
  playlist: MusicPlaylist,
  autoplay: boolean,
  videoId?: string,
) {
  // youtube-nocookie keeps YouTube from writing tracking cookies until the
  // driver actually plays something.
  const params = new URLSearchParams({
    list: playlist.playlistId,
    rel: "0",
    modestbranding: "1",
  });
  if (autoplay) params.set("autoplay", "1");
  // Naming a video still passes `list=`, so the rest of the playlist stays
  // queued behind it and next/prev keep working from that point. Without one,
  // `videoseries` starts the queue at the top, in the creator's order.
  return videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?${params}`
    : `https://www.youtube-nocookie.com/embed/videoseries?${params}`;
}

const listUrl = (playlist: MusicPlaylist) =>
  `https://www.youtube.com/playlist?list=${playlist.playlistId}`;

export function MusicPlayer({ tracks = {} }: { tracks?: PlaylistTracks }) {
  const { t, locale } = useLanguage();
  const m = t.music;
  // Locale-specific playlist copy is authored in data/music.ts as en/hi pairs;
  // every other locale reads the English side, same as the product catalogue.
  const lang = locale === "hi" ? "hi" : "en";

  const [activeId, setActiveId] = useState(musicPlaylists[0].id);
  // Separate from `activeId`: the first playlist is *selected* on arrival so
  // the player has something to show, but nothing is *playing* until a tap.
  const [started, setStarted] = useState(false);
  // The song a driver picked out of the list. Null means "start at the top",
  // which is what choosing a playlist does.
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [category, setCategory] = useState<MusicCategory | "all">("all");
  const playerRef = useRef<HTMLDivElement>(null);

  const active =
    musicPlaylists.find((p) => p.id === activeId) ?? musicPlaylists[0];

  const visible = useMemo(
    () =>
      category === "all"
        ? musicPlaylists
        : musicPlaylists.filter((p) => p.category === category),
    [category],
  );

  const play = (playlist: MusicPlaylist) => {
    setActiveId(playlist.id);
    // A different playlist starts at its own beginning, not at the position of
    // whatever was playing before.
    setActiveVideo(null);
    setStarted(true);
    // Tapping a card far down the grid otherwise starts a song with the player
    // off-screen, which reads as "nothing happened".
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const playSong = (videoId: string) => {
    setActiveVideo(videoId);
    setStarted(true);
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const songs = tracks[active.playlistId] ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28">
      {/* Breadcrumb back to the hub the Music tile was tapped from. */}
      <p className="text-sm opacity-60">
        <Link
          href="/for-drivers"
          className="hover:text-brandtext hover:underline"
        >
          {m.back}
        </Link>{" "}
        &gt; <span className="font-medium opacity-100">{m.crumb}</span>
      </p>

      <div className="mt-4 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brandtext">
          {m.eyebrow}
        </p>
        <h1
          className={`${display.className} mt-3 bg-gradient-to-r from-brand via-brand-light to-accent bg-clip-text py-1 text-4xl font-bold tracking-tight text-transparent sm:text-5xl`}
        >
          {m.heading}
        </h1>
        <p className="mt-4 text-lg leading-relaxed opacity-75">{m.sub}</p>
      </div>

      {/* ── Player ─────────────────────────────────────────────────────── */}
      <div ref={playerRef} className="mt-10 scroll-mt-28">
        <div className="overflow-hidden rounded-3xl border border-black/10 bg-black shadow-xl dark:border-white/10">
          <div className="relative aspect-video">
            {started ? (
              <iframe
                // Remounting on every change is what makes the next playlist
                // actually start; swapping `src` alone leaves the old queue
                // loaded in some browsers.
                key={`${active.id}:${activeVideo ?? "top"}`}
                src={embedSrc(active, true, activeVideo ?? undefined)}
                title={active.title[lang]}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <button
                type="button"
                onClick={() => play(active)}
                className="group absolute inset-0 h-full w-full"
                aria-label={`${m.play}: ${active.title[lang]}`}
              >
                <Artwork playlist={active} index={0} priority sizes="100vw" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand text-white shadow-2xl transition group-hover:scale-105 group-active:scale-95">
                    <span className="material-symbols-outlined text-[44px] [font-variation-settings:'FILL'_1]">
                      play_arrow
                    </span>
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Title strip under the player */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brandtext">
              {started ? m.nowPlaying : m.upNext}
            </p>
            <h2 className="mt-1 truncate text-xl font-extrabold">
              {active.title[lang]}
            </h2>
            <p className="mt-0.5 text-sm opacity-65">{active.blurb[lang]}</p>
          </div>
          <a
            href={listUrl(active)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold transition hover:border-brand/40 hover:text-brandtext dark:border-white/15"
          >
            <span className="material-symbols-outlined text-[18px] text-red-500">
              smart_display
            </span>
            {m.openYoutube}
          </a>
        </div>
      </div>

      {/* ── Songs in the active playlist ───────────────────────────────── */}
      {songs.length > 0 && (
        <div className="mt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-extrabold">{m.songsTitle}</h2>
            <span className="text-sm opacity-60">
              {songs.length} {m.songsCount}
            </span>
          </div>
          <p className="mt-1 text-sm opacity-60">{m.songsSub}</p>

          {/* Capped height so the grid below stays reachable without a long
              scroll past 90-odd songs on a phone. */}
          <ul className="mt-4 max-h-[26rem] divide-y divide-black/5 overflow-y-auto rounded-2xl border border-black/10 dark:divide-white/5 dark:border-white/10">
            {songs.map((song, i) => {
              const isPlaying = started && song.videoId === activeVideo;
              return (
                <li key={`${song.videoId}-${i}`}>
                  <button
                    type="button"
                    onClick={() => playSong(song.videoId)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-brand/[0.06] ${
                      isPlaying ? "bg-brand/[0.09]" : ""
                    }`}
                  >
                    <span className="w-6 shrink-0 text-center text-xs font-semibold tabular-nums opacity-45">
                      {isPlaying ? (
                        <span className="material-symbols-outlined text-[18px] text-brandtext [font-variation-settings:'FILL'_1]">
                          graphic_eq
                        </span>
                      ) : (
                        i + 1
                      )}
                    </span>
                    {/* mqdefault is a quarter the weight of hqdefault, and
                        these load 90 at a time on a mobile pack. */}
                    <span className="relative aspect-video w-20 shrink-0 overflow-hidden rounded-md bg-black/20">
                      <Image
                        src={`https://img.youtube.com/vi/${song.videoId}/mqdefault.jpg`}
                        alt=""
                        aria-hidden
                        fill
                        unoptimized
                        loading="lazy"
                        sizes="80px"
                        className="object-cover"
                      />
                    </span>
                    <span
                      className={`min-w-0 flex-1 truncate text-sm ${
                        isPlaying ? "font-bold text-brandtext" : "font-medium"
                      }`}
                    >
                      {song.title}
                    </span>
                    <span className="material-symbols-outlined shrink-0 text-[20px] opacity-35">
                      play_arrow
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* The fetch stops at 100 songs; say so rather than let a driver
              think the playlist ends there. */}
          {songs.length >= 100 && (
            <p className="mt-2 text-xs opacity-50">{m.songsMore}</p>
          )}
        </div>
      )}

      {/* ── Playlist grid ──────────────────────────────────────────────── */}
      <div className="mt-14">
        <h2 className="text-lg font-extrabold">{m.allTitle}</h2>
        <p className="mt-1 text-sm opacity-60">{m.allSub}</p>

        {/* Category chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Chip
            active={category === "all"}
            onClick={() => setCategory("all")}
            label={m.filterAll}
          />
          {MUSIC_CATEGORIES.map((c) => (
            <Chip
              key={c}
              active={category === c}
              onClick={() => setCategory(c)}
              label={m.categories[c]}
            />
          ))}
        </div>

        {/* Two across on a phone: eight full-width cards is a long scroll for
            someone standing at the roadside, and the artwork is still the
            thing a driver recognises a playlist by, so it stays. */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {visible.map((playlist, i) => {
            const isActive = playlist.id === active.id;
            return (
              <button
                key={playlist.id}
                type="button"
                onClick={() => play(playlist)}
                className={`group overflow-hidden rounded-xl border bg-white/[0.02] text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl sm:rounded-2xl ${
                  isActive
                    ? "border-brand ring-2 ring-brand/30"
                    : "border-black/10 hover:border-brand/40 dark:border-white/10"
                }`}
              >
                <div className="relative aspect-video overflow-hidden bg-black">
                  <Artwork
                    playlist={playlist}
                    index={i}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <span className="absolute bottom-1.5 right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow-lg transition group-hover:scale-105 sm:bottom-2 sm:right-2 sm:h-11 sm:w-11">
                    <span className="material-symbols-outlined text-[20px] [font-variation-settings:'FILL'_1] sm:text-[26px]">
                      {isActive && started ? "graphic_eq" : "play_arrow"}
                    </span>
                  </span>
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-black/55 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white backdrop-blur sm:left-2 sm:top-2 sm:px-2.5 sm:py-1 sm:text-[10px]">
                    {m.categories[playlist.category]}
                  </span>
                </div>
                <div className="p-2.5 sm:p-4">
                  <h3 className="line-clamp-2 text-sm font-bold leading-snug sm:text-base">
                    {playlist.title[lang]}
                  </h3>
                  {/* The blurb is a nice-to-have, not the label — at two
                      columns it would push the cards tall again, so a phone
                      gets the title alone. Hidden on the wrapper, because
                      `hidden` and `line-clamp-2` both set `display` and would
                      otherwise fight over it. */}
                  <div className="hidden sm:block">
                    <p className="mt-1 line-clamp-2 text-sm opacity-65">
                      {playlist.blurb[lang]}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Notes ──────────────────────────────────────────────────────── */}
      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        <Note icon="warning" tone="brand" title={m.safetyTitle} body={m.safetyBody} />
        <Note icon="signal_cellular_alt" tone="accent" title={m.dataTitle} body={m.dataBody} />
      </div>

      <p className="mt-8 text-xs leading-relaxed opacity-50">{m.disclaimer}</p>
    </div>
  );
}

/** Playlist artwork: a YouTube thumbnail when we have a cover video, a tinted
 *  panel with the playlist's icon when we don't. */
function Artwork({
  playlist,
  index,
  sizes,
  priority,
}: {
  playlist: MusicPlaylist;
  index: number;
  sizes: string;
  priority?: boolean;
}) {
  if (playlist.cover) {
    return (
      <Image
        src={`https://img.youtube.com/vi/${playlist.cover}/hqdefault.jpg`}
        alt=""
        aria-hidden
        fill
        unoptimized
        priority={priority}
        sizes={sizes}
        className="object-cover transition duration-300 group-hover:scale-105"
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${
        TINTS[index % TINTS.length]
      }`}
    >
      <span className="material-symbols-outlined text-[72px] text-white/85">
        {playlist.icon}
      </span>
    </span>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
        active
          ? "border-brand bg-brand text-white"
          : "border-black/10 hover:border-brand/40 hover:text-brandtext dark:border-white/15"
      }`}
    >
      {label}
    </button>
  );
}

function Note({
  icon,
  tone,
  title,
  body,
}: {
  icon: string;
  tone: "brand" | "accent";
  title: string;
  body: string;
}) {
  const ring =
    tone === "brand"
      ? "border-brand/30 bg-brand/[0.06]"
      : "border-accent/30 bg-accent/[0.06]";
  const text = tone === "brand" ? "text-brandtext" : "text-accent";
  return (
    <div className={`flex gap-3 rounded-2xl border p-4 ${ring}`}>
      <span className={`material-symbols-outlined shrink-0 text-[22px] ${text}`}>
        {icon}
      </span>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed opacity-75">{body}</p>
      </div>
    </div>
  );
}
