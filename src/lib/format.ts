export function timeAgo(input: Date | string): string {
  const date = typeof input === "string" ? new Date(input) : input;
  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatBirr(min: number, max?: number): string {
  if (!max || min === max) return `${min} birr`;
  return `${min}–${max} birr`;
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}

export function formatMeters(meters: number): string {
  if (meters < 1000) return `${Math.round(meters / 10) * 10} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export const crowdMeta: Record<string, { label: string; chip: string; dot: string }> = {
  empty: { label: "Empty", chip: "bg-emerald-50 text-emerald-800 ring-emerald-200", dot: "bg-emerald-500" },
  moderate: { label: "Moderate", chip: "bg-amber-50 text-amber-900 ring-amber-200", dot: "bg-amber-500" },
  packed: { label: "Packed", chip: "bg-orange-50 text-orange-900 ring-orange-200", dot: "bg-orange-500" },
  overflowing: { label: "Overflowing", chip: "bg-red-50 text-red-800 ring-red-200", dot: "bg-red-500" },
};

export function crowdOf(crowd: string | null | undefined) {
  return crowdMeta[crowd ?? ""] ?? { label: "No reports", chip: "bg-stone-100 text-stone-600 ring-stone-200", dot: "bg-stone-400" };
}

export const contributionTypes: Record<string, string> = {
  new_station: "New station",
  moved_station: "Station moved",
  route: "Route changed",
  fare: "Fare update",
  correction: "Correction",
};

export const feedbackCategories: Record<string, string> = {
  suggestion: "Suggestion",
  bug: "Bug report",
  praise: "Praise",
  partnership: "Partnership",
};
