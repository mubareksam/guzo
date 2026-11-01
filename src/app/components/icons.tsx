import { Bus, BusFront, CarTaxiFront, Footprints, TramFront, type LucideProps } from "lucide-react";
import type { Mode } from "@/lib/transit";

export function BajajIcon({ size = 24, strokeWidth = 2, className, ...rest }: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...(rest as React.SVGProps<SVGSVGElement>)}
    >
      <path d="M4 16V9a5 5 0 0 1 5-5h4.5l4.5 6v6" />
      <path d="M4 11h14" />
      <path d="M11 4v7" />
      <circle cx="6.5" cy="17.5" r="2" />
      <circle cx="17" cy="17.5" r="2" />
      <path d="M8.5 17.5H15" />
    </svg>
  );
}

export function ModeIcon({ mode, ...props }: { mode: Mode | "walk" | string } & LucideProps) {
  switch (mode) {
    case "train":
      return <TramFront {...props} />;
    case "city_bus":
      return <BusFront {...props} />;
    case "intercity_bus":
      return <Bus {...props} />;
    case "bajaj":
      return <BajajIcon {...props} />;
    case "walk":
      return <Footprints {...props} />;
    default:
      return <CarTaxiFront {...props} />;
  }
}

/** Raw SVG markup for Leaflet div-icons (cannot render React there). */
export const RAW_ICONS: Record<string, string> = {
  minibus:
    '<path d="M10 2h4"/><path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8"/><path d="M7 14h.01"/><path d="M17 14h.01"/><rect width="18" height="8" x="3" y="10" rx="2"/><path d="M5 18v2"/><path d="M19 18v2"/>',
  train:
    '<rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><path d="M8 15h.01"/><path d="M16 15h.01"/>',
  bus: '<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>',
  bajaj:
    '<path d="M4 16V9a5 5 0 0 1 5-5h4.5l4.5 6v6"/><path d="M4 11h14"/><path d="M11 4v7"/><circle cx="6.5" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/><path d="M8.5 17.5H15"/>',
  person: '<circle cx="12" cy="5" r="1.6"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  arrowDown: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
};

export function rawSvg(name: keyof typeof RAW_ICONS | string, size = 16, stroke = "currentColor") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${RAW_ICONS[name] ?? RAW_ICONS.pin}</svg>`;
}
