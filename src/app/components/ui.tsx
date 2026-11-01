import type { ReactNode } from "react";
import { badgeFor } from "@/lib/badges";
import { crowdOf } from "@/lib/format";
import { MODE_INFO, modeInfo, STATION_KIND_INFO, type Mode } from "@/lib/transit";
import { ModeIcon } from "./icons";

export function CrowdPill({ crowd, small }: { crowd: string | null; small?: boolean }) {
  const meta = crowdOf(crowd);
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full ring-1 ${meta.chip} ${
        small ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      } font-medium`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

/** Square pictogram tile in the mode colour — the "sign" used across the app. */
export function ModeTile({ mode, size = 28, dim }: { mode: Mode | "walk"; size?: number; dim?: boolean }) {
  const color = mode === "walk" ? "#2f7d5b" : MODE_INFO[mode].color;
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-[9px] text-white shadow-sm ${dim ? "opacity-35 grayscale" : ""}`}
      style={{ width: size, height: size, background: color }}
      title={mode === "walk" ? "Walk" : MODE_INFO[mode].label}
    >
      <ModeIcon mode={mode} size={Math.round(size * 0.6)} strokeWidth={2.2} />
    </span>
  );
}

export function ModeChip({ mode, small, label }: { mode: Mode | string; small?: boolean; label?: string }) {
  const info = modeInfo(mode);
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-semibold ring-1 ring-black/5 ${info.soft} ${info.text} ${
        small ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      <ModeIcon mode={mode} size={small ? 12 : 14} strokeWidth={2.4} />
      {label ?? info.short}
    </span>
  );
}

/** Shows which transport modes a station has: departing (solid) and passing by (outlined). */
export function StationModes({ depart, pass, size = 26 }: { depart: Mode[]; pass?: Mode[]; size?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {depart.map((m) => (
        <ModeTile key={`d-${m}`} mode={m} size={size} />
      ))}
      {(pass ?? []).map((m) => (
        <span
          key={`p-${m}`}
          title={`${MODE_INFO[m].label} passes by`}
          className="inline-grid place-items-center rounded-[9px] border-2 border-dashed bg-white"
          style={{ width: size, height: size, borderColor: MODE_INFO[m].color, color: MODE_INFO[m].color }}
        >
          <ModeIcon mode={m} size={Math.round(size * 0.55)} strokeWidth={2.2} />
        </span>
      ))}
    </div>
  );
}

export function StationKindBadge({ kind }: { kind: string }) {
  const info = STATION_KIND_INFO[kind] ?? STATION_KIND_INFO.tera;
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-forest/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-forest ring-1 ring-forest/15">
      {info.label}
    </span>
  );
}

/** Station name plate styled after real transit signage. */
export function TransitSign({
  name,
  am,
  kind,
  modes,
  passModes,
  compact,
}: {
  name: string;
  am?: string | null;
  kind: string;
  modes: Mode[];
  passModes?: Mode[];
  compact?: boolean;
}) {
  const info = STATION_KIND_INFO[kind] ?? STATION_KIND_INFO.tera;
  return (
    <div className="overflow-hidden rounded-2xl bg-forest text-cream shadow-[0_14px_34px_rgba(18,69,50,0.28)] ring-1 ring-black/10">
      <div className="flex items-center justify-between gap-3 bg-black/15 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
        <span>
          {info.label} · {info.am}
        </span>
        <span className="hidden sm:inline">Addis Ababa</span>
      </div>
      <div className={`flex flex-wrap items-center justify-between gap-3 px-4 ${compact ? "py-3" : "py-4"}`}>
        <div className="min-w-0">
          <p className={`${compact ? "text-lg" : "text-2xl sm:text-[28px]"} font-bold leading-tight tracking-tight`}>{name}</p>
          {am ? <p className={`${compact ? "text-sm" : "text-base"} mt-0.5 font-medium text-cream/75`}>{am}</p> : null}
        </div>
        <StationModes depart={modes} pass={passModes} size={compact ? 26 : 32} />
      </div>
    </div>
  );
}

export function BadgeChip({ points, showPoints }: { points: number; showPoints?: boolean }) {
  const badge = badgeFor(points);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${badge.chip} ring-black/5`}>
      <span aria-hidden>{badge.icon}</span>
      {badge.name}
      {showPoints ? <span className="font-normal opacity-70">· {points} pts</span> : null}
    </span>
  );
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className="inline-grid shrink-0 place-items-center rounded-full bg-forest font-semibold text-cream ring-2 ring-white/60"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials || "G"}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-4 ${align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"}`}>
      <div className="max-w-2xl">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.22em] text-moss">{eyebrow}</p> : null}
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>
        {description ? <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, hint, icon }: { label: string; value: string | number; hint?: string; icon?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-forest/10 bg-white/80 p-4 sm:p-5">
      {icon ? <div className="text-forest">{icon}</div> : null}
      <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">{label}</p>
      {hint ? <p className="mt-1 text-xs text-ink/60">{hint}</p> : null}
    </div>
  );
}

export function EmptyState({ title, body, icon }: { title: string; body: string; icon?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-forest/20 bg-white/60 p-8 text-center">
      {icon ? <div className="mx-auto mb-2 grid place-items-center text-forest">{icon}</div> : null}
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink/60">{body}</p>
    </div>
  );
}
