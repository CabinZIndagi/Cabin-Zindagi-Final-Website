/**
 * Playlists shown on /music — the driver hub's Music tile.
 *
 * Nothing is hosted here. Each entry names a public YouTube playlist, and the
 * page embeds it; the creators keep their views and their ads. That is also why
 * an entry can rot — a playlist can be deleted or made private by its owner and
 * the embed then shows YouTube's own error. When one does, swap `playlistId`
 * for a live playlist rather than deleting the card, so the grid keeps its
 * shape.
 *
 * To find an id: open the playlist on YouTube and copy the `list=` value out of
 * the URL. It always starts with `PL`.
 *
 * `cover` is a VIDEO id (not a playlist id) whose thumbnail is used as the
 * card's artwork — YouTube publishes no static thumbnail URL for a playlist, so
 * a representative video from it stands in. Leave it unset and the card falls
 * back to a tinted panel with its icon, which is a perfectly good card; it is
 * never worth inventing an id to fill.
 */

export type MusicCategory =
  | "hindi"
  | "punjabi"
  | "bhojpuri"
  | "marathi"
  | "bhakti"
  | "night";

export type MusicPlaylist = {
  id: string;
  /** YouTube `list=` id. */
  playlistId: string;
  category: MusicCategory;
  title: { en: string; hi: string };
  blurb: { en: string; hi: string };
  /** Material Symbols name, used when `cover` is unset. */
  icon: string;
  /** A video id from the playlist, for the card artwork. Optional. */
  cover?: string;
};

/**
 * Order is the running order of the grid, and the first entry is what the
 * player is pointed at before a driver picks anything — so keep the most
 * broadly wanted playlist first.
 */
export const musicPlaylists: MusicPlaylist[] = [
  {
    id: "truck-90s",
    playlistId: "PLBKzzWUn97obv4qD4CcPba5U1nrha2vGH",
    category: "hindi",
    icon: "local_shipping",
    cover: "1GxcjPmuZX0",
    title: { en: "Truck Driver ke Gaane", hi: "ट्रक ड्राइवर के गाने" },
    blurb: {
      en: "The 90s Hindi songs every cabin already knows by heart.",
      hi: "90 के दशक के वही गाने जो हर केबिन को ज़ुबानी याद हैं।",
    },
  },
  {
    id: "highway-hindi",
    playlistId: "PLFoPKbFUU2Rppl9ENyGFDu2uhYyqTG8s2",
    category: "hindi",
    icon: "mic",
    cover: "uE2vAOWIZCg",
    title: { en: "Highway Sing-Alongs", hi: "हाईवे के गाने" },
    blurb: {
      en: "Hindi tracks made for singing through a long stretch.",
      hi: "लंबे सफ़र में साथ गाने लायक हिंदी गाने।",
    },
  },
  {
    id: "punjabi-truck",
    playlistId: "PL7AbpvutOR2yx2AKqXLKp2ihSlzBw-Emx",
    category: "punjabi",
    icon: "music_note",
    cover: "zAkO4_WcuFo",
    title: { en: "Punjabi Truck Songs", hi: "पंजाबी ट्रक गाने" },
    blurb: {
      en: "Driveran de geet — the trucker classics from Punjab.",
      hi: "ड्राइवरां दे गीत — पंजाब के ट्रक वाले क्लासिक।",
    },
  },
  {
    id: "punjabi-truckan",
    playlistId: "PLt5kJ0CmibgQyci4ZChIfQM8bvH7wLNLv",
    category: "punjabi",
    icon: "queue_music",
    title: { en: "Truckan Wale", hi: "ट्रकां वाले" },
    blurb: {
      en: "More Punjabi road songs, for when the first one runs out.",
      hi: "और पंजाबी सफ़री गाने, पहली लिस्ट ख़त्म होने पर।",
    },
  },
  {
    id: "bhojpuri",
    playlistId: "PLJ3M6AoVR-gZtOkB4v-_XgzYQz_6UQssJ",
    category: "bhojpuri",
    icon: "celebration",
    cover: "owaaUcVvMT4",
    title: { en: "Bhojpuri Hits", hi: "भोजपुरी हिट" },
    blurb: {
      en: "Big Bhojpuri hits to keep the miles moving.",
      hi: "भोजपुरी के बड़े हिट, जो सफ़र चलाते रहें।",
    },
  },
  {
    id: "marathi",
    playlistId: "PLnGgwGS29G0GtH18HbpGqvMxJCko1fG4G",
    category: "marathi",
    icon: "library_music",
    title: { en: "Marathi All-Time Hits", hi: "मराठी सदाबहार गाने" },
    blurb: {
      en: "Superhit Marathi songs for the Mumbai–Pune runs.",
      hi: "मुंबई–पुणे रूट के लिए सुपरहिट मराठी गाने।",
    },
  },
  {
    id: "bhakti",
    playlistId: "PL4qQTPxoIspFOjN7C_w6rspTIrqhllBtH",
    category: "bhakti",
    icon: "self_improvement",
    cover: "j8VQpFJkKDM",
    title: { en: "Morning Bhajans", hi: "सुबह के भजन" },
    blurb: {
      en: "Bhajans and aartis to start the day on the road.",
      hi: "सफ़र का दिन शुरू करने के लिए भजन और आरती।",
    },
  },
  {
    id: "night-drive",
    playlistId: "PL4fXyPNB21BPqXVgTKtCYzxAp4B958i_P",
    category: "night",
    icon: "bedtime",
    cover: "KRA26LhuTP4",
    title: { en: "Night Drive Vibes", hi: "रात के सफ़र की धुनें" },
    blurb: {
      en: "Slow, calm Hindi tracks for the dark stretches.",
      hi: "अँधेरे रास्तों के लिए धीमे, शांत हिंदी गाने।",
    },
  },
];

/** Category filter chips, in the order they should appear after "All". */
export const MUSIC_CATEGORIES = Array.from(
  new Set(musicPlaylists.map((p) => p.category)),
) as MusicCategory[];
