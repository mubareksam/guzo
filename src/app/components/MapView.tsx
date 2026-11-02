"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip, useMap, useMapEvents, ZoomControl } from "react-leaflet";
import { Layers, Map as MapIcon, Satellite, Mountain } from "lucide-react";
import { rawSvg } from "./icons";

export type MarkerKind =
  | "tera"
  | "lrt"
  | "intercity"
  | "bajaj_stand"
  | "bus_terminal"
  | "origin"
  | "destination"
  | "board"
  | "alight"
  | "selected"
  | "stop";

export type MapMarker = {
  id: string | number;
  lat: number;
  lng: number;
  label: string;
  sublabel?: string;
  kind?: MarkerKind;
  href?: string;
  color?: string;
};

export type MapLine = {
  id: string | number;
  points: Array<[number, number]>;
  color?: string;
  dashed?: boolean;
  weight?: number;
  opacity?: number;
};

export type MapViewProps = {
  markers: MapMarker[];
  lines?: MapLine[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  fitKey?: string;
  onMapClick?: (lat: number, lng: number) => void;
  legend?: boolean;
  dark?: boolean;
};

const KIND_STYLE: Record<string, { bg: string; icon: string; size: number; radius: string }> = {
  tera: { bg: "#124532", icon: "minibus", size: 30, radius: "9px" },
  bajaj_stand: { bg: "#124532", icon: "bajaj", size: 30, radius: "9px" },
  lrt: { bg: "#0284c7", icon: "train", size: 30, radius: "9px" },
  intercity: { bg: "#7c3aed", icon: "bus", size: 30, radius: "9px" },
  bus_terminal: { bg: "#16a34a", icon: "bus", size: 30, radius: "9px" },
  selected: { bg: "#e3ae3c", icon: "minibus", size: 38, radius: "11px" },
  origin: { bg: "#2f7d5b", icon: "person", size: 36, radius: "999px" },
  destination: { bg: "#b4493c", icon: "flag", size: 36, radius: "999px" },
  board: { bg: "#0d2018", icon: "minibus", size: 32, radius: "9px" },
  alight: { bg: "#ffffff", icon: "pin", size: 30, radius: "999px" },
};

const iconCache = new Map<string, L.DivIcon>();
function iconFor(kind: MarkerKind, color?: string) {
  const key = `${kind}:${color ?? ""}`;
  const cached = iconCache.get(key);
  if (cached) return cached;
  const style = KIND_STYLE[kind] ?? KIND_STYLE.tera;
  const bg = color ?? style.bg;
  const fg = kind === "alight" ? "#0d2018" : kind === "selected" ? "#0d2018" : "#ffffff";
  const html = `<div class="guzo-pin ${kind === "origin" ? "guzo-pin--pulse" : ""}" style="width:${style.size}px;height:${style.size}px;background:${bg};border-radius:${style.radius};color:${fg};${
    kind === "alight" ? "border-color:#0d2018;" : ""
  }">${rawSvg(style.icon, Math.round(style.size * 0.55), fg)}</div>`;
  const icon = L.divIcon({ className: "", html, iconSize: [style.size, style.size], iconAnchor: [style.size / 2, style.size / 2], popupAnchor: [0, -style.size / 2] });
  iconCache.set(key, icon);
  return icon;
}

function ViewSync({ center, zoom, fitPoints, fitKey }: { center?: [number, number]; zoom?: number; fitPoints: Array<[number, number]>; fitKey?: string }) {
  const map = useMap();
  useEffect(() => {
    if (fitKey && fitPoints.length > 1) {
      map.fitBounds(L.latLngBounds(fitPoints), { padding: [36, 36], maxZoom: 16 });
    } else if (fitKey && fitPoints.length === 1) {
      map.setView(fitPoints[0], 15, { animate: true });
    } else if (center) {
      map.setView(center, zoom ?? 13, { animate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitKey, center?.[0], center?.[1], zoom, map]);
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 250);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

function ClickCatcher({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick?.(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapView({ markers, lines = [], center, zoom, className, fitKey, onMapClick, legend }: MapViewProps) {
  const [mapStyle, setMapStyle] = useState<MapStyle>("standard");
  const start: [number, number] = center ?? (markers[0] ? [markers[0].lat, markers[0].lng] : [9.0108, 38.7613]);
  const fitPoints = useMemo(() => {
    const pts: Array<[number, number]> = [];
    for (const line of lines) pts.push(...line.points);
    for (const m of markers) if (m.kind && m.kind !== "tera" && m.kind !== "lrt" && m.kind !== "intercity" && m.kind !== "bajaj_stand") pts.push([m.lat, m.lng]);
    if (pts.length === 0) for (const m of markers) pts.push([m.lat, m.lng]);
    return pts;
  }, [lines, markers]);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className ?? ""}`}>
      <MapContainer center={start} zoom={zoom ?? 13} scrollWheelZoom className="h-full w-full" zoomControl={false} attributionControl>
        <TileSelector style={mapStyle} />
        <ViewSync center={center} zoom={zoom} fitPoints={fitPoints} fitKey={fitKey} />
        <ClickCatcher onMapClick={onMapClick} />
        <ZoomControl position="topright" />
        {lines.map((line) => (
          <Polyline
            key={`casing-${line.id}`}
            positions={line.points}
            pathOptions={{ color: "#ffffff", weight: (line.weight ?? 5) + 4, opacity: line.dashed ? 0.7 : 0.95, lineCap: "round", lineJoin: "round" }}
          />
        ))}
        {lines.map((line) => (
          <Polyline
            key={`line-${line.id}`}
            positions={line.points}
            pathOptions={{
              color: line.color ?? "#124532",
              weight: line.weight ?? 5,
              opacity: line.opacity ?? 0.95,
              dashArray: line.dashed ? "2 9" : undefined,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        ))}
        {markers.map((marker) =>
          marker.kind === "stop" ? (
            <CircleMarker
              key={`stop-${marker.id}`}
              center={[marker.lat, marker.lng]}
              radius={5}
              pathOptions={{ color: marker.color ?? "#124532", weight: 3, fillColor: "#ffffff", fillOpacity: 1 }}
            >
              <Tooltip direction="top" offset={[0, -4]}>
                {marker.label}
              </Tooltip>
            </CircleMarker>
          ) : (
            <Marker key={`${marker.kind}-${marker.id}`} position={[marker.lat, marker.lng]} icon={iconFor(marker.kind ?? "tera", marker.color)}>
              <Popup>
                <div className="min-w-[170px] max-w-[240px]">
                  <p className="m-0 text-[13px] font-semibold text-[#0d2018]">{marker.label}</p>
                  {marker.sublabel ? <p className="m-0 mt-1 text-[12px] leading-snug text-[#4a5f55]">{marker.sublabel}</p> : null}
                  {marker.href ? (
                    <a className="mt-2 inline-block text-[12px] font-semibold text-[#124532] underline" href={marker.href}>
                      Open station →
                    </a>
                  ) : null}
                </div>
              </Popup>
            </Marker>
          ),
        )}
      </MapContainer>
      <MapStyleControl style={mapStyle} onChange={setMapStyle} />
      {legend ? (
        <div className="pointer-events-none absolute bottom-6 left-2 z-[400] hidden rounded-xl bg-white/95 px-2.5 py-2 text-[10px] font-medium text-ink/70 shadow-md ring-1 ring-black/5 sm:block">
          {[
            ["#e0a526", "Minibus"],
            ["#16a34a", "City bus"],
            ["#0284c7", "Light rail"],
            ["#db2777", "Bajaj"],
            ["#7c3aed", "Intercity"],
          ].map(([c, l]) => (
            <div key={l} className="flex items-center gap-1.5 py-0.5">
              <span className="h-1 w-4 rounded-full" style={{ background: c }} />
              {l}
            </div>
          ))}
          <div className="flex items-center gap-1.5 py-0.5">
            <span className="h-0 w-4 border-t-2 border-dotted border-moss" />
            Walk
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Available map tile sources — all free, no API key required. */
export type MapStyle = "standard" | "satellite" | "terrain";

const TILE_SOURCES: Record<MapStyle, {
  url: string;
  subdomains: string[];
  attribution: string;
  maxZoom: number;
  label: string;
  icon: typeof MapIcon;
  darkFilter?: boolean;
}> = {
  standard: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    subdomains: [],
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    label: "Map",
    icon: MapIcon,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    subdomains: [],
    attribution: "&copy; Esri, Maxar, Earthstar Geographics",
    maxZoom: 18,
    label: "Satellite",
    icon: Satellite,
  },
  terrain: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    subdomains: ["a", "b", "c"],
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (&copy; OpenStreetMap, SRTM)',
    maxZoom: 17,
    label: "Terrain",
    icon: Mountain,
  },
};

const FALLBACK_TILES = [
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
];

function TileSelector({ style }: { style: MapStyle }) {
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const source = TILE_SOURCES[style];

  // For satellite/terrain, if tiles fail, fall back to OSM
  if (style !== "standard") {
    return (
      <>
        <TileLayer
          key={source.url}
          url={source.url}
          subdomains={source.subdomains.length ? source.subdomains : ["a", "b", "c"]}
          attribution={source.attribution}
          maxZoom={source.maxZoom}
          eventHandlers={{
            tileerror: () => {
              const next = errors + 1;
              if (next >= 6 && fallbackIndex < FALLBACK_TILES.length - 1) {
                setFallbackIndex(fallbackIndex + 1);
                setErrors(0);
              } else {
                setErrors(next);
              }
            },
          }}
        />
        {errors >= 6 && fallbackIndex >= FALLBACK_TILES.length - 1 ? (
          <TileLayer
            key="fallback-osm"
            url={FALLBACK_TILES[0]}
            subdomains={["a", "b", "c"]}
            attribution={TILE_SOURCES.standard.attribution}
            maxZoom={19}
          />
        ) : null}
      </>
    );
  }

  // Standard view with built-in fallback
  const url = errors >= 4 && fallbackIndex < FALLBACK_TILES.length - 1
    ? FALLBACK_TILES[fallbackIndex]
    : source.url;

  return (
    <TileLayer
      key={url}
      url={url}
      subdomains={source.subdomains.length ? source.subdomains : ["a", "b", "c"]}
      attribution={source.attribution}
      maxZoom={source.maxZoom}
      eventHandlers={{
        tileerror: () => {
          const next = errors + 1;
          setErrors(next);
          if (next >= 4 && fallbackIndex < FALLBACK_TILES.length - 1) {
            setFallbackIndex(fallbackIndex + 1);
            setErrors(0);
          }
        },
      }}
    />
  );
}

/** Map style toggle control (positioned on the map). */
function MapStyleControl({ style, onChange }: { style: MapStyle; onChange: (s: MapStyle) => void }) {
  const styles: MapStyle[] = ["standard", "satellite", "terrain"];
  return (
    <div className="absolute bottom-6 right-2 z-[1000] flex flex-col gap-1 rounded-xl bg-white/95 p-1 shadow-lg ring-1 ring-black/10 backdrop-blur-sm dark:bg-[#111a16]/95">
      {styles.map((s) => {
        const Icon = TILE_SOURCES[s].icon;
        const active = s === style;
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition ${
              active
                ? "bg-forest text-cream"
                : "text-ink/60 hover:bg-forest/10 hover:text-ink"
            }`}
            title={TILE_SOURCES[s].label}
          >
            <Icon size={13} />
            <span className="hidden min-[360px]:inline">{TILE_SOURCES[s].label}</span>
          </button>
        );
      })}
    </div>
  );
}
