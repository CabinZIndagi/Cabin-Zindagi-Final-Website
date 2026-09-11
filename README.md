# 🚛 Cabin Zindagi — The Human Side of Logistics

> *"Agar Chakkaa nahi Ghumega, Toh Jahaj nahi Udega."*
> **If the wheels don't turn, the plane doesn't fly.**

---

## 📖 The Story

Somewhere on a national highway right now, a truck driver is **8 to 10 months** into a year away from home. He hauls the food on your table, the phone in your hand, the medicine in your cabinet. There are **9 million** people like him keeping India moving — and almost nobody knows their names.

**Cabin Zindagi** climbs into the cabin to change that. We record the real, unscripted stories of India's truck drivers, carry their voices into boardrooms and policy tables, and build things that make life on the road a little more human — a clean water bottle, a travel kit, a place to actually sleep.

This repository is the **marketing site** that tells that story to the world. 🌍

Built with care (and a fair amount of caffeine ☕) using **Next.js 15 · React 19 · Tailwind CSS**.

---

## 🗺️ The Tour — Pages

| | Page | What's inside |
|---|------|----------------|
| 🏠 | **Home** (`/`) | A scroll-scrubbed video hero that reveals the story beat-by-beat — brand → *What We Do* → the three pillars → the *"Agar Chakkaa…"* quote — flowing into a Before/After outcome and an Impact CTA |
| 💛 | **Impact** (`/impact`) | A scroll-animated timeline, a CTA banner, and a one-time contribution module |
| 📦 | **Products** (`/products`) | Pricing-style cards (Water Bottle, Driver Travel Kit, Modular Dormitory) + a dormitory image showcase |
| ✉️ | **Contact** (`/contact`) | Two-column layout with a world map and an EmailJS-powered form |

---

## ✨ The Cool Stuff — Features

- 🌗 **Light / Dark mode** — navbar toggle (`next-themes`), respects your system preference, remembers your choice.
- 🇬🇧 ⇄ 🇮🇳 **English ⇄ Hindi** — one toggle flips the *entire* site's language. Every word lives in `lib/dictionaries.ts`.
- 📬 **Contact form** — sends email via **EmailJS**, no backend required. Logs to console until you add keys.
- 🪄 **Interactive effects** — `SplashCursor` (desktop + non-reduced-motion only), Aceternity boxes & timeline, spotlight cards.
- 🎞️ **Scroll-scrubbed hero** — a pinned video whose playback is driven by your scroll while the story reveals beat-by-beat (brand → pillars → quote).
- 📺 **Live subscriber count** — the Stories page pulls the YouTube channel's subscriber count via the YouTube Data API (server-side, hourly cached).
- 🎵 **Music for drivers** — `/music` embeds curated YouTube playlists, with a tap-to-play song list when a `YOUTUBE_API_KEY` is set.

---

## 🎬 The Scroll Hero

The headline experience. The `ScrollVideo` component pins a video to the screen and
**scrubs its playback from scroll position** (no autoplay) while the copy — brand →
tagline → *What We Do* → the three pillars → the closing quote — reveals beat-by-beat,
then hands off to the Outcome and an Impact CTA.

Knobs (props on `<ScrollVideo />`):

| Prop | Does |
|------|------|
| `src` | Which clip to scrub |
| `reveal` | Text entrance: `fade` · `blur` · `wipe` · `fadeup` · `mask` |
| `brandColor` | `logo` (orange/green) or `theme` (black ↔ white) |
| `inset` | Full-bleed vs. a rounded, contained card |

Plus `SectionSnap` (scroll-snaps each beat into view so nothing gets skipped) and
`ImpactTransition` (the closing "move India" CTA into `/impact`). 🛣️

> 🎥 Hero clips live in `public/`. For buttery scrubbing, re-encode with dense
> keyframes: `ffmpeg -i in.mp4 -an -g 6 -crf 20 out.mp4`.

---

## 🚀 Getting Started

Three commands and you're on the road:

```bash
npm install
npm run dev      # 🏁 http://localhost:3000
```

> 📍 Project root lives at `~/Desktop/CabinZindagi`.

---

## 📧 Turning On the Contact Form

The form works out of the box in dev (it just logs to the browser console 🪵). To make it actually send email:

1. Grab a free account at **[emailjs.com](https://www.emailjs.com)** and set up an email **service** + **template**.
   - Template variables: `{{from_name}}`, `{{from_email}}`, `{{company}}`, `{{interest}}`, `{{message}}`.
2. Copy `.env.local.example` → `.env.local` and drop in your IDs:
   ```bash
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
   ```
3. Restart `npm run dev`. 🔄

---

## 📺 Turning On the YouTube Features

**Optional.** One server-side key powers two things:

- the **live subscriber count** on the Stories page (cached hourly), and
- the **song list** under the player on the Music page — the track listing that lets a driver tap a specific song instead of skipping through the playlist (cached daily).

Without the key both pages work exactly as they do now: Stories hides the count, and Music falls back to YouTube's own next/prev buttons. Nothing errors. 👍

1. Create a project at **[console.cloud.google.com](https://console.cloud.google.com)**.
2. **APIs & Services → Library** → enable **YouTube Data API v3**.
3. **APIs & Services → Credentials → Create credentials → API key**.
4. Restrict it to the YouTube Data API v3. ⚠️ Do **not** add an HTTP-referrer restriction — this key is used server-side and a referrer rule would block it.
5. Add it to `.env.local` and restart `npm run dev`:
   ```bash
   YOUTUBE_API_KEY=...
   ```

> 🔒 No `NEXT_PUBLIC_` prefix, so the key never reaches the browser.
> 📊 Quota is a non-issue: 1 unit per request against 10,000/day free, and everything is cached.

---

## 🧭 Where to Edit Things

Lost? Here's your map. 🗺️

| What you want to change | The file to open |
|-------------------------|------------------|
| 📝 All site text (EN + HI) | `lib/dictionaries.ts` |
| 🏷️ Products & prices | `data/products.ts` |
| 🎵 Driver music playlists | `data/music.ts` |
| 🖼️ Dormitory / product images | `public/products/`, `public/` |
| 🎨 Brand colors (orange / green) | `tailwind.config.ts` (`colors.brand`, `accent`) |
| 🔤 Display font | `lib/fonts.ts` |
| 🧩 Home page sections / order | `app/page.tsx` |
| 🎬 Scroll-hero video + reveals | `components/ScrollVideo.tsx` |
| 🧲 Scroll-snap behavior | `components/SectionSnap.tsx` |
| 🛣️ Impact transition CTA | `components/ImpactTransition.tsx` |

---

## 🌐 Deploy

Push to GitHub, import the repo at **[vercel.com](https://vercel.com)**, and add the three `NEXT_PUBLIC_EMAILJS_*` variables in your Vercel project settings. Ship it. 🚀

> 🔑 `.env.local` is gitignored, so it does **not** travel with the push. Any server-side key you rely on in production — `SUPABASE_*`, and `YOUTUBE_API_KEY` if you want the subscriber count and the song list — has to be added in the host's environment variables too, then redeployed.

---

<p align="center">
  <strong>Made for the people who keep India moving.</strong> 💚🧡<br/>
  <em>Every rupee, every story, every wheel that turns.</em>
</p>
