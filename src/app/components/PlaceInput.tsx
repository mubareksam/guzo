"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, Crosshair, Landmark, LocateFixed, MapPin, MousePointerClick, X } from "lucide-react";

export type PlaceValue = { label: string; lat: number; lng: number; source?: "gps" | "search" | "map" };

type Hit = { id: string; label: string; sublabel: string; lat: number; lng: number; kind: "area" | "station" | "landmark" };

export default function PlaceInput({
  id,
  label,
  dotClass,
  value,
  onChange,
  placeholder,
  onUseLocation,
  locating,
  onPickOnMap,
  picking,
}: {
  id: string;
  label: string;
  dotClass: string;
  value: PlaceValue | null;
  onChange: (value: PlaceValue | null, rawText?: string) => void;
  placeholder: string;
  onUseLocation?: () => void;
  locating?: boolean;
  onPickOnMap?: () => void;
  picking?: boolean;
}) {
  const [text, setText] = useState(value?.label ?? "");
  const [open, setOpen] = useState(false);
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setText(value?.label ?? "");
  }, [value?.label, value?.lat, value?.lng]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (value && text === value.label) {
      setHits([]);
      return;
    }
    let alive = true;
    const quick = setTimeout(async () => {
      try {
        const r = await fetch(`/api/places?osm=0&q=${encodeURIComponent(text)}`);
        const d = (await r.json()) as { hits: Hit[] };
        if (alive) setHits(d.hits);
      } catch {
        /* ignore */
      }
    }, 120);
    const full =
      text.trim().length >= 3
        ? setTimeout(async () => {
            setLoading(true);
            try {
              const r = await fetch(`/api/places?q=${encodeURIComponent(text)}`);
              const d = (await r.json()) as { hits: Hit[] };
              if (alive) setHits(d.hits);
            } catch {
              /* ignore */
            } finally {
              if (alive) setLoading(false);
            }
          }, 650)
        : null;
    return () => {
      alive = false;
      clearTimeout(quick);
      if (full) clearTimeout(full);
    };
  }, [text, open, value]);

  const choose = (hit: Hit) => {
    onChange({ label: hit.label, lat: hit.lat, lng: hit.lng, source: "search" });
    setText(hit.label);
    setOpen(false);
    setActive(-1);
  };

  const KindIcon = ({ kind }: { kind: Hit["kind"] }) =>
    kind === "station" ? <Building2 size={15} /> : kind === "landmark" ? <Landmark size={15} /> : <MapPin size={15} />;

  return (
    <div ref={boxRef} className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className={`flex items-center gap-2.5 rounded-2xl border bg-white px-3 py-2.5 transition ${open ? "border-forest/50 ring-4 ring-forest/10" : "border-forest/15"}`}>
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ring-4 ${dotClass}`} />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40">{label}</p>
          <input
            id={id}
            value={text}
            autoComplete="off"
            placeholder={placeholder}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setText(e.target.value);
              onChange(null, e.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(hits.length - 1, a + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(-1, a - 1));
              } else if (e.key === "Enter" && active >= 0 && hits[active]) {
                e.preventDefault();
                choose(hits[active]);
              } else if (e.key === "Escape") setOpen(false);
            }}
            className="w-full truncate bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink/35"
          />
        </div>
        {loading ? <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-forest/20 border-t-forest" /> : null}
        {text ? (
          <button
            type="button"
            aria-label={`Clear ${label}`}
            onClick={() => {
              setText("");
              onChange(null, "");
              setOpen(true);
            }}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink/40 hover:bg-forest/5 hover:text-ink"
          >
            <X size={15} />
          </button>
        ) : null}
      </div>

      {open ? (
        <div className="animate-rise absolute z-[1200] mt-2 max-h-[22rem] w-full overflow-auto rounded-2xl border border-forest/10 bg-white p-1.5 shadow-[0_24px_60px_rgba(13,32,24,0.2)] scroll-thin">
          {onUseLocation ? (
            <button
              type="button"
              onClick={() => {
                onUseLocation();
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-emerald-50"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                {locating ? <Crosshair size={16} className="animate-spin" /> : <LocateFixed size={16} />}
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">Use my current location</span>
                <span className="block text-[11px] text-ink/50">Asks your browser for permission · never stored</span>
              </span>
            </button>
          ) : null}
          {onPickOnMap ? (
            <button
              type="button"
              onClick={() => {
                onPickOnMap();
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-cream ${picking ? "bg-cream" : ""}`}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-cream text-forest">
                <MousePointerClick size={16} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">Choose on the map</span>
                <span className="block text-[11px] text-ink/50">Tap anywhere on the map to set this point</span>
              </span>
            </button>
          ) : null}
          {hits.length > 0 ? <div className="my-1 border-t border-forest/5" /> : null}
          {hits.map((hit, i) => (
            <button
              key={hit.id}
              type="button"
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(hit)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left ${active === i ? "bg-cream" : "hover:bg-cream/70"}`}
            >
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                  hit.kind === "station" ? "bg-forest text-cream" : hit.kind === "landmark" ? "bg-sky-50 text-sky-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                <KindIcon kind={hit.kind} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink">{hit.label}</span>
                <span className="block truncate text-[11px] text-ink/50">{hit.sublabel}</span>
              </span>
              <span className="shrink-0 rounded-md bg-forest/5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-forest">
                {hit.kind === "station" ? "Stop" : hit.kind === "landmark" ? "Place" : "Area"}
              </span>
            </button>
          ))}
          {text.trim().length >= 3 && hits.length === 0 && !loading ? (
            <p className="px-3 py-3 text-xs text-ink/55">No match yet — try a nearby landmark, church, mall or area name.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
