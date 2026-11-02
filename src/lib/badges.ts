/**
 * Ethiopian Traditional Imperial Honour System — Cultural Ranking for Contributors
 *
 * Based on the ancient military & noble titles of the Ethiopian Empire,
 * from the Solomonic dynasty (1270) through the Imperial era (ended 1974).
 * These are the REAL traditional ranks — the battlefield formation titles
 * that defined Ethiopian military hierarchy for over 700 years.
 *
 * The army formation was:
 *   Vanguard (Fit Awrari) → Center (Dej Azmach) → Left (Gera Azmach)
 *   → Right (Kegn Azmach) → Rear (Azmach)
 *
 * Above all stood the Ras (Duke/Head), then Negus (King),
 * and at the apex: Negusa Negest — King of Kings.
 *
 * Point thresholds are exponentially harder — the highest rank
 * is virtually unreachable, keeping the system aspirational forever.
 */

export type Badge = {
  min: number;
  name: string;       // Traditional English title
  am: string;         // Amharic (Ge'ez script)
  icon: string;       // Emoji
  blurb: string;      // Short description of what this rank means
  ring: string;       // Tailwind ring color class
  chip: string;       // Tailwind bg/text classes for chip display
  color: string;      // Hex color for special UI accents
};

export const badges: Badge[] = [
  {
    min: 0,
    name: "Asir Aleqa",
    am: "አሲር አለቃ",
    icon: "🌱",
    blurb: "Commander of Ten — You've taken your first step on the ancient road. The journey of a thousand miles begins here.",
    ring: "ring-stone-300",
    chip: "bg-stone-100 text-stone-700",
    color: "#a8a29e",
  },
  {
    min: 30,
    name: "Hams Aleqa",
    am: "ሀምሳ አለቃ",
    icon: "🥾",
    blurb: "Commander of Fifty — You know every tera in your neighbourhood. Riders look to you for directions.",
    ring: "ring-emerald-300",
    chip: "bg-emerald-50 text-emerald-800",
    color: "#6ee7b7",
  },
  {
    min: 80,
    name: "Mato Aleqa",
    am: "ማቶ አለቃ",
    icon: "🧭",
    blurb: "Commander of a Hundred — Your reports guide dozens of riders daily. The tera masters trust your word.",
    ring: "ring-teal-300",
    chip: "bg-teal-50 text-teal-800",
    color: "#5eead4",
  },
  {
    min: 200,
    name: "Shambel",
    am: "ሻምበል",
    icon: "🗺️",
    blurb: "Commander of Two Hundred Fifty — A seasoned leader of riders. Your corrections shape the map.",
    ring: "ring-sky-300",
    chip: "bg-sky-50 text-sky-900",
    color: "#7dd3fc",
  },
  {
    min: 500,
    name: "Shaleqa",
    am: "ሻለቃ",
    icon: "🚐",
    blurb: "Commander of a Thousand — A thousand riders owe you directions. You are known at every stand.",
    ring: "ring-blue-400",
    chip: "bg-blue-50 text-blue-900",
    color: "#60a5fa",
  },
  {
    min: 1200,
    name: "Balambaras",
    am: "ባላምባራስ",
    icon: "🏰",
    blurb: "Keeper of the Citadel — An ancient title of noble origin. Your contributions fortify the whole map.",
    ring: "ring-indigo-400",
    chip: "bg-indigo-50 text-indigo-900",
    color: "#818cf8",
  },
  {
    min: 2800,
    name: "Azmach",
    am: "አዝማች",
    icon: "🔰",
    blurb: "Commander of the Rearguard — You protect the rear, ensuring no rider is left behind.",
    ring: "ring-violet-400",
    chip: "bg-violet-50 text-violet-900",
    color: "#a78bfa",
  },
  {
    min: 5500,
    name: "Gera Azmach",
    am: "ግራ አዝማች",
    icon: "🛡️",
    blurb: "Commander of the Left Wing — One of the oldest aristocratic titles. A district looks to you for truth.",
    ring: "ring-purple-400",
    chip: "bg-purple-50 text-purple-900",
    color: "#c084fc",
  },
  {
    min: 10000,
    name: "Kegn Azmach",
    am: "ቀኝ አዝማች",
    icon: "⚔️",
    blurb: "Commander of the Right Wing — Equal to Gera Azmach in honour. You lead battalions of knowledge.",
    ring: "ring-fuchsia-400",
    chip: "bg-fuchsia-50 text-fuchsia-900",
    color: "#e879f9",
  },
  {
    min: 18000,
    name: "Fit Awrari",
    am: "ፊት አውራሪ",
    icon: "🦁",
    blurb: "Leader of the Vanguard — You charge ahead, breaking new ground for every rider behind you. A true pioneer.",
    ring: "ring-amber-400",
    chip: "bg-amber-50 text-amber-900",
    color: "#fbbf24",
  },
  {
    min: 32000,
    name: "Dej Azmach",
    am: "ደጃዝማች",
    icon: "👑",
    blurb: "Commander of the Gate — The highest military honour before nobility. You guard the heart of Addis Ababa's transit.",
    ring: "ring-yellow-500",
    chip: "bg-yellow-100 text-yellow-900",
    color: "#eab308",
  },
  {
    min: 60000,
    name: "Bitwoded",
    am: "ቢትወደድ",
    icon: "💎",
    blurb: "Beloved of the King — The highest non-royal title. Only a handful will ever hold this honour.",
    ring: "ring-rose-400",
    chip: "bg-rose-50 text-rose-900",
    color: "#fb7185",
  },
  {
    min: 100000,
    name: "Ras",
    am: "ራስ",
    icon: "🌟",
    blurb: "The Head — Duke of the realm. A living legend whose name is spoken at every tera from Entoto to Akaki.",
    ring: "ring-amber-500",
    chip: "bg-amber-100 text-amber-950",
    color: "#d97706",
  },
  {
    min: 200000,
    name: "Negus",
    am: "ንጉስ",
    icon: "🏛️",
    blurb: "King of the Roads — You have mapped a kingdom. Few in history have reached this height.",
    ring: "ring-yellow-600",
    chip: "bg-yellow-200 text-yellow-950",
    color: "#ca8a04",
  },
  {
    min: 500000,
    name: "Negusa Negest",
    am: "ነገሠ ነገሥት",
    icon: "✦",
    blurb: "King of Kings — The supreme honour of the Ethiopian Empire. You are Guzo itself, eternal and unmatched.",
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
