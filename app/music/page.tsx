import { DriverGate } from "@/components/DriverGate";
import { MusicPlayer } from "@/components/MusicPlayer";
import { musicPlaylists } from "@/data/music";
import { pageMetadata } from "@/lib/site";
import { getPlaylistTracks } from "@/lib/youtube";

export const metadata = pageMetadata("/music");

export default async function MusicPage() {
  // Server-side: the Data API key must never reach the browser, and the track
  // lists are cached for a day, so this costs a driver nothing.
  const tracks = await getPlaylistTracks(
    musicPlaylists.map((p) => p.playlistId),
  );

  return (
    <DriverGate>
      <MusicPlayer tracks={tracks} />
    </DriverGate>
  );
}
