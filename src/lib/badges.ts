/**
 * Ethiopian Imperial Honour System — Cultural Ranking for Contributors
 *
 * Based on the traditional military & noble titles of the Ethiopian Empire
 * (Solomonic dynasty through the Imperial era). Each rank corresponds to a
 * historical role in the emperor's field army, from the youngest drummer boy
 * to the Negusa Negest himself.
 *
 * The point thresholds are designed to be *exponentially* harder to reach —
 * most contributors will spend months between ranks, and the highest title
 * (Negusa Negest) requires sustained contribution over years. This keeps
 * the system aspirational without ever running out.
 *
 * Army formation order (for context):
 *   Vanguard (Fitawrari) → Center (Dejazmach) → Left (Gerazmach)
 *   → Right (Kenyazmach) → Rear (Azmach)
 */

export type Badge = {
  min: number;
  name: string;       // English title
  am: string;         // Amharic transliteration
  icon: string;       // Emoji
  blurb: string;      // Short description of what this rank means
  ring: string;       // Tailwind ring color class
  chip: string;       // Tailwind bg/text classes for chip display
  color: string;      // Hex color for special UI accents
};

export const badges: Badge[] = [
  {
    min: 0,
    name: "Asiraleqa",
    am: "አሲራለቃ",
    icon: "🌱",
    blurb: "Commander of 10 — You've taken your first step. The journey begins.",
    ring: "ring-stone-300",
    chip: "bg-stone-100 text-stone-700",
    color: "#a8a29e",
  },
  {
    min: 30,
    name: "Hamsaleqa",
    am: "ሀምሳለቃ",
    icon: "🥾",
    blurb: "Commander of 50 — You know your neighbourhood tera by heart.",
    ring: "ring-emerald-300",
    chip: "bg-emerald-50 text-emerald-800",
    color: "#6ee7b7",
  },
  {
    min: 80,
    name: "Matoaleqa",
    am: "ማቶለቃ",
    icon: "🧭",
    blurb: "Commander of 100 — Your reports guide dozens of riders daily.",
    ring: "ring-teal-300",
    chip: "bg-teal-50 text-teal-800",
    color: "#5eead4",
  },
  {
    min: 200,
    name: "Shambel",
    am: "ሻምበል",
    icon: "🗺️",
    blurb: "Commander of 250 — Station masters trust your corrections.",
    ring: "ring-sky-300",
    chip: "bg-sky-50 text-sky-900",
    color: "#7dd3fc",
  },
  {
    min: 500,
    name: "Shaleqa",
    am: "ሻለቃ",
    icon: "🚐",
    blurb: "Commander of 1,000 — A thousand riders owe you directions.",
    ring: "ring-blue-400",
    chip: "bg-blue-50 text-blue-900",
    color: "#60a5fa",
  },
  {
    min: 1000,
    name: "Balambaras",
    am: "ባላምባራስ",
    icon: "🏰",
    blurb: "Keeper of the Citadel — Your contributions fortify the whole map.",
    ring: "ring-indigo-400",
    chip: "bg-indigo-50 text-indigo-900",
    color: "#818cf8",
  },
  {
    min: 2200,
    name: "Kenyazmach",
    am: "ቀኝአዝማች",
    icon: "⚔️",
    blurb: "Commander of the Right Wing — You lead from the front line.",
    ring: "ring-violet-400",
    chip: "bg-violet-50 text-violet-900",
    color: "#a78bfa",
  },
  {
    min: 4500,
    name: "Gerazmach",
    am: "ግራዝማች",
    icon: "🛡️",
    blurb: "Commander of the Left Wing — A district looks to you for truth.",
    ring: "ring-purple-400",
    chip: "bg-purple-50 text-purple-900",
    color: "#c084fc",
  },
  {
    min: 8500,
    name: "Fitawrari",
    am: "ፊትአውራሪ",
    icon: "🦁",
    blurb: "Leader of the Vanguard — You break new ground for every rider behind you.",
    ring: "ring-amber-400",
    chip: "bg-amber-50 text-amber-900",
    color: "#fbbf24",
  },
  {
    min: 15000,
    name: "Dejazmach",
    am: "ደጅአዝማች",
    icon: "👑",
    blurb: "Commander of the Gate — You guard the heart of Addis Ababa's transit.",
    ring: "ring-yellow-500",
    chip: "bg-yellow-100 text-yellow-900",
    color: "#eab308",
  },
  {
    min: 30000,
    name: "Bitwoded",
    am: "ቢትወደድ",
    icon: "💎",
    blurb: "Beloved of the City — The rarest honour. All of Addis rides because of you.",
    ring: "ring-rose-400",
    chip: "bg-rose-50 text-rose-900",
    color: "#fb7185",
  },
  {
    min: 60000,
    name: "Ras",
    am: "ራስ",
    icon: "🌟",
    blurb: "Head of the Provinces — A living legend. Your name is spoken at every tera.",
    ring: "ring-amber-500",
    chip: "bg-amber-100 text-amber-950",
    color: "#d97706",
  },
  {
    min: 120000,
    name: "Negus",
    am: "ንጉስ",
    icon: "🏛️",
    blurb: "King of the Roads — You have mapped a kingdom. Few will ever reach here.",
    ring: "ring-yellow-600",
    chip: "bg-yellow-200 text-yellow-950",
    color: "#ca8a04",
  },
  {
    min: 300000,
    name: "Negusa Negest",
    am: "ነገሠ ነገሥት",
    icon: "✦",
    blurb: "King of Kings — The supreme honour. You are Guzo itself.",
    ring: "ring-yellow-500",
    chip: "bg-gradient-to-r from-yellow-200 via-amber-200 to-yellow-300 text-yellow-950",
    color: "#b45309",
  },
];

export function badgeFor(points: number): Badge {
  let current = badges[0];
  for (const badge of badges) {
    if (points >= badge.min) current = badge;
  }
  return current;
}

export function nextBadge(points: number): { badge: Badge; remaining: number } | null {
  const upcoming = badges.find((b) => b.min > points);
  if (!upcoming) return null;
  return { badge: upcoming, remaining: upcoming.min - points };
}

/** Return a progress fraction (0-1) toward the next rank. */
export function rankProgress(points: number): number {
  const current = badgeFor(points);
  const next = badges.find((b) => b.min > points);
  if (!next) return 1;
  const span = next.min - current.min;
  if (span <= 0) return 1;
  return Math.min(1, (points - current.min) / span);
}
