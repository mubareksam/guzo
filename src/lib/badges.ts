export type Badge = {
  min: number;
  name: string;
  am: string;
  icon: string;
  blurb: string;
  ring: string;
  chip: string;
};

export const badges: Badge[] = [
  {
    min: 0,
    name: "Newcomer",
    am: "አዲስ መንገደኛ",
    icon: "🌱",
    blurb: "You just joined the map. Welcome to Guzo.",
    ring: "ring-stone-300",
    chip: "bg-stone-100 text-stone-700",
  },
  {
    min: 25,
    name: "Wanderer",
    am: "ተጓዥ",
    icon: "🧭",
    blurb: "You know your way around the tera.",
    ring: "ring-emerald-300",
    chip: "bg-emerald-50 text-emerald-800",
  },
  {
    min: 75,
    name: "Pathfinder",
    am: "መንገድ ፈላጊ",
    icon: "🗺️",
    blurb: "Your crowd reports keep the map honest.",
    ring: "ring-amber-300",
    chip: "bg-amber-50 text-amber-900",
  },
  {
    min: 150,
    name: "Tera Guide",
    am: "ተራ መሪ",
    icon: "🚐",
    blurb: "Riders trust your stations and fares.",
    ring: "ring-sky-300",
    chip: "bg-sky-50 text-sky-900",
  },
  {
    min: 300,
    name: "Guzo Legend",
    am: "የጉዞ አፈ ታሪክ",
    icon: "⭐",
    blurb: "The map is more accurate because of you.",
    ring: "ring-yellow-400",
    chip: "bg-yellow-100 text-yellow-900",
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
