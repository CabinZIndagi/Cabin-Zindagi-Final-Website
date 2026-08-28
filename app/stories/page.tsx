import { Stories } from "@/components/Stories";
import { pageMetadata } from "@/lib/site";

const CHANNEL_ID = "UCQXmE1mYZFDzvBn0AXMqTrA"; // @cabinzindagi

function decode(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

// Newest 3 uploads (videos or shorts) from the channel's public RSS feed.
async function getLatestVideos(): Promise<{ id: string; title: string }[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { next: { revalidate: 3600 } }, // refresh hourly
    );
    if (!res.ok) return [];
    const xml = await res.text();
    return xml
      .split("<entry>")
      .slice(1)
      .map((e) => ({
        id: e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "",
        title: decode(e.match(/<title>([^<]+)<\/title>/)?.[1] ?? ""),
      }))
      .filter((v) => v.id && v.title)
      .slice(0, 3);
  } catch {
    return [];
  }
}

// Live subscriber count via the YouTube Data API (needs a server-side key).
// Returns null when the key is missing or the request fails, so the UI can
// simply hide the count instead of breaking.
async function getSubscriberCount(): Promise<number | null> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${key}`,
      { next: { revalidate: 3600 } }, // refresh hourly
    );
    if (!res.ok) return null;
    const data = await res.json();
    const count = data?.items?.[0]?.statistics?.subscriberCount;
    return count ? Number(count) : null;
  } catch {
    return null;
  }
}

export const metadata = pageMetadata("/stories");

export default async function StoriesPage() {
  const [latestVideos, subscribers] = await Promise.all([
    getLatestVideos(),
    getSubscriberCount(),
  ]);
  return <Stories latestVideos={latestVideos} subscribers={subscribers} />;
}
