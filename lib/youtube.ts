/**
 * Track listings for the playlists on /music.
 *
 * The embed alone gives a driver next/prev and nothing else — no way to see
 * what is coming or jump to a song they want. That list has to come from the
 * YouTube Data API, which needs a server-side key.
 *
 * The key is OPTIONAL, exactly as on the Stories page: without it every lookup
 * returns an empty list and the page simply renders the player without a track
 * list, which is what it did before this existed. Never let a missing key or a
 * failed request break the page — a driver at the roadside would rather have a
 * working player than an error.
 *
 * Quota: `playlistItems` costs 1 unit per request against a 10,000/day free
 * allowance, and the responses are cached for a day, so the whole page costs
 * roughly a dozen units daily.
 */

export type PlaylistTrack = {
  videoId: string;
  title: string;
};

/** Track lists keyed by the YouTube `list=` id. */
export type PlaylistTracks = Record<string, PlaylistTrack[]>;

/** The API's per-request maximum. */
const PAGE_SIZE = 50;

/**
 * How deep to read into a playlist. The longest list on the page is ~99 songs,
 * so two pages covers everything; a playlist that grows past this is simply
 * shown truncated rather than costing more quota and a bigger HTML payload.
 */
const MAX_TRACKS = 100;

/** A day. The playlists are other people's and change rarely. */
const REVALIDATE_SECONDS = 86_400;

/** Placeholder titles YouTube returns for entries that are no longer playable. */
const DEAD_TITLES = new Set(["Private video", "Deleted video"]);

type ApiItem = {
  snippet?: {
    title?: string;
    resourceId?: { videoId?: string };
  };
};

async function fetchPlaylist(
  playlistId: string,
  key: string,
): Promise<PlaylistTrack[]> {
  const tracks: PlaylistTrack[] = [];
  let pageToken = "";

  try {
    while (tracks.length < MAX_TRACKS) {
      const url = new URL(
        "https://www.googleapis.com/youtube/v3/playlistItems",
      );
      url.searchParams.set("part", "snippet");
      url.searchParams.set("maxResults", String(PAGE_SIZE));
      url.searchParams.set("playlistId", playlistId);
      url.searchParams.set("key", key);
      if (pageToken) url.searchParams.set("pageToken", pageToken);

      const res = await fetch(url, {
        next: { revalidate: REVALIDATE_SECONDS },
      });
      // A bad key, a deleted playlist or an exhausted quota all land here.
      // Whatever was collected so far is still worth showing.
      if (!res.ok) break;

      const data = (await res.json()) as {
        items?: ApiItem[];
        nextPageToken?: string;
      };

      for (const item of data.items ?? []) {
        const videoId = item.snippet?.resourceId?.videoId;
        const title = item.snippet?.title?.trim();
        // A playlist keeps its entries after a video goes private or is
        // deleted; those cannot be played, so they are not offered.
        if (!videoId || !title || DEAD_TITLES.has(title)) continue;
        tracks.push({ videoId, title });
      }

      if (!data.nextPageToken) break;
      pageToken = data.nextPageToken;
    }
  } catch {
    // Network failure at build or request time — fall through with whatever
    // was read.
  }

  return tracks.slice(0, MAX_TRACKS);
}

/**
 * Reads the track list for every playlist given, in parallel.
 *
 * Returns `{}` when `YOUTUBE_API_KEY` is unset, which is the signal the player
 * uses to hide the track list entirely.
 */
export async function getPlaylistTracks(
  playlistIds: string[],
): Promise<PlaylistTracks> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return {};

  const unique = Array.from(new Set(playlistIds));
  const lists = await Promise.all(
    unique.map((id) => fetchPlaylist(id, key)),
  );

  const out: PlaylistTracks = {};
  unique.forEach((id, i) => {
    // An empty list is dropped rather than stored, so the player's "do we have
    // tracks for this playlist?" check stays a simple presence test.
    if (lists[i].length) out[id] = lists[i];
  });
  return out;
}
