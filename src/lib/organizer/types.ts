export type FileKind = "image" | "video" | "audio" | "document" | "archive" | "code" | "other";

export interface MockFile {
  id: string;
  name: string;
  ext: string;
  kind: FileKind;
  size: number; // bytes
  created: string; // ISO
  modified: string; // ISO
  path: string;
  folder: string;
  hash?: string;
  // audio-specific
  bitrate?: number;
  duration?: number;
  sampleRate?: number;
  // image
  width?: number;
  height?: number;
  // generic
  starred?: boolean;
}

export interface ArrangeRule {
  id: string;
  mode: "date" | "type" | "size" | "similarity" | "name" | "extension";
  // date
  dateField?: "created" | "modified";
  dateGrouping?: "year" | "year-month" | "year-month-day" | "relative";
  // size
  sizeRanges?: { label: string; min: number; max: number; color: string }[];
  // type mapping
  typeMap?: Record<string, string[]>;
  // similarity
  similarityThreshold?: number; // 0-1
  // name
  namePattern?: string;
}

export interface DuplicateGroup {
  id: string;
  reason: string;
  criteria: string[];
  files: MockFile[];
  wastedBytes: number;
}

export interface RenameRule {
  pattern: string; // e.g. "{name}_{num:03}"
  find?: string;
  replace?: string;
  useRegex?: boolean;
  caseMode?: "keep" | "lower" | "upper" | "title" | "camel";
  prefix?: string;
  suffix?: string;
  numbering?: { start: number; step: number; pad: number; enabled: boolean };
  extensionMode?: "keep" | "lower" | "upper" | "custom";
  customExt?: string;
}

export interface FolderStyle {
  id: string;
  name: string;
  color: string;
  accent: string;
  glass: boolean;
  icon: "default" | "mac" | "glass" | "neon" | "minimal" | "pill" | "archive";
  emoji?: string;
}

export interface OrganizePreview {
  originalPath: string;
  newPath: string;
  newFolder: string;
  file: MockFile;
}

export const KIND_CONFIG: Record<FileKind, { label: string; color: string; bg: string; icon: string; extensions: string[] }> = {
  image: { label: "Images", color: "#0e7490", bg: "bg-cyan-500", icon: "🖼️", extensions: ["jpg","jpeg","png","webp","heic","gif","svg","bmp","tiff"] },
  video: { label: "Videos", color: "#7c3aed", bg: "bg-violet-500", icon: "🎬", extensions: ["mp4","mkv","mov","avi","webm","m4v","3gp"] },
  audio: { label: "Audio", color: "#db2777", bg: "bg-pink-500", icon: "🎵", extensions: ["mp3","flac","wav","m4a","ogg","aac","wma","aiff"] },
  document: { label: "Documents", color: "#2563eb", bg: "bg-blue-500", icon: "📄", extensions: ["pdf","docx","doc","xlsx","pptx","txt","rtf","odt"] },
  archive: { label: "Archives", color: "#ca8a04", bg: "bg-yellow-500", icon: "📦", extensions: ["zip","rar","7z","tar","gz","iso"] },
  code: { label: "Code", color: "#059669", bg: "bg-emerald-500", icon: "💻", extensions: ["js","ts","py","rs","go","java","cpp","json","html","css"] },
  other: { label: "Others", color: "#64748b", bg: "bg-slate-500", icon: "📁", extensions: [] },
};

export function inferKind(ext: string): FileKind {
  const e = ext.toLowerCase();
  for (const [k, cfg] of Object.entries(KIND_CONFIG) as [FileKind, typeof KIND_CONFIG[FileKind]][]) {
    if (cfg.extensions.includes(e)) return k;
  }
  if (["json","xml","yaml","yml","toml"].includes(e)) return "code";
  return "other";
}

export function extOf(name: string) {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i+1).toLowerCase();
}

export function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024*1024) return `${(bytes/1024).toFixed(bytes>1024*10?0:1)} KB`;
  if (bytes < 1024*1024*1024) return `${(bytes/1024/1024).toFixed(bytes>1024*1024*10?0:1)} MB`;
  return `${(bytes/1024/1024/1024).toFixed(2)} GB`;
}

export function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-CA");
}

export const DEFAULT_SIZE_RANGES = [
  { label: "Tiny", min: 0, max: 1*1024*1024, color: "#10b981" },
  { label: "Small", min: 1*1024*1024, max: 10*1024*1024, color: "#3b82f6" },
  { label: "Medium", min: 10*1024*1024, max: 100*1024*1024, color: "#f59e0b" },
  { label: "Large", min: 100*1024*1024, max: 1024*1024*1024, color: "#ef4444" },
  { label: "Huge", min: 1024*1024*1024, max: Number.MAX_SAFE_INTEGER, color: "#7c3aed" },
];

export const FOLDER_STYLES: FolderStyle[] = [
  { id: "default", name: "Windows Default", color: "#facc15", accent: "#eab308", glass: false, icon: "default", emoji: "📁" },
  { id: "mac", name: "macOS", color: "#60a5fa", accent: "#3b82f6", glass: false, icon: "mac", emoji: "📂" },
  { id: "glass", name: "Glass / Acrylic", color: "rgba(255,255,255,0.55)", accent: "rgba(255,255,255,0.9)", glass: true, icon: "glass", emoji: "✨" },
  { id: "neon", name: "Neon", color: "#a78bfa", accent: "#7c3aed", glass: false, icon: "neon", emoji: "💜" },
  { id: "forest", name: "Forest", color: "#34d399", accent: "#059669", glass: false, icon: "minimal", emoji: "🌿" },
  { id: "sunset", name: "Sunset", color: "#fb7185", accent: "#e11d48", glass: false, icon: "pill", emoji: "🌅" },
  { id: "ocean", name: "Ocean", color: "#38bdf8", accent: "#0284c7", glass: true, icon: "glass", emoji: "🌊" },
  { id: "amber", name: "Amber", color: "#fbbf24", accent: "#d97706", glass: false, icon: "archive", emoji: "📦" },
];
