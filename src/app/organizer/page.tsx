"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Folder, FolderOpen, Sparkles, Search, Trash2, Copy, ArrowRight, Wand2, LayoutGrid, Image as ImgIcon, Music, Film, FileText, Archive, Code2,
  Calendar, Ruler, Scan, Hash, Palette, Eye, Settings2, Play, Pause, SkipBack, SkipForward, Volume2, Download, Check, X, Plus, ArrowUpDown,
  Monitor, Moon, Sun, Layers, Paintbrush, FileSearch, ClipboardList, Type, Trash, MoveRight, EyeOff, ShieldCheck, Zap, Database, Clock, HardDrive,
  Grip, ChevronRight, ChevronDown, FileStack, Sparkle, RefreshCw, Filter, Clock3
} from "lucide-react";
import { MOCK_FILES } from "@/lib/organizer/mockData";
import { ArrangeRule, MockFile, humanSize, KIND_CONFIG, inferKind, DEFAULT_SIZE_RANGES, FOLDER_STYLES } from "@/lib/organizer/types";
import { arrangePreview, summarizePreview, findDuplicates, applyRename } from "@/lib/organizer/engine";

type Tab = "arrange" | "duplicates" | "rename" | "styles" | "preview";
type Theme = "light" | "dark" | "midnight" | "aurora" | "sunset";

const THEMES: Record<Theme, { bg: string; card: string; accent: string; name: string }> = {
  light: { bg: "bg-[#f8fafc]", card: "bg-white", accent: "bg-[#0ea5e9]", name: "Light" },
  dark: { bg: "bg-[#0f1115]", card: "bg-[#1a1d24]", accent: "bg-[#38bdf8]", name: "Dark" },
  midnight: { bg: "bg-[#04060a]", card: "bg-[#0f1419]", accent: "bg-[#a78bfa]", name: "Midnight" },
  aurora: { bg: "bg-[#f0fdf4]", card: "bg-white", accent: "bg-[#10b981]", name: "Aurora" },
  sunset: { bg: "bg-[#fff7ed]", card: "bg-white", accent: "bg-[#f97316]", name: "Sunset" },
};

function FolderIcon({ style, size=48, active }: { style: typeof FOLDER_STYLES[number], size?: number, active?: boolean }) {
  const s = style;
  const glass = s.glass ? "backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.6)]" : "shadow-[0_6px_18px_rgba(0,0,0,0.12)]";
  const macBump = s.icon==="mac";
  return (
    <div className={`relative ${glass} overflow-hidden ${macBump ? "rounded-[14px]" : "rounded-[12px]"}`} style={{ width: size, height: size*0.78, background: s.glass ? `linear-gradient(180deg, ${s.color} 0%, rgba(255,255,255,0.2) 100%)` : s.color }}>
      {/* tab */}
      <div className="absolute -top-[3px] left-2 h-[10px] w-[38%] rounded-t-[8px] opacity-95" style={{ background: s.accent }} />
      {/* shine */}
      <div className="absolute inset-0 rounded-[12px] bg-gradient-to-br from-white/35 via-transparent to-transparent" />
      <div className="absolute inset-x-2 bottom-2 top-2 grid place-items-center text-xl opacity-95">{s.emoji}</div>
      {active && <div className="absolute inset-0 rounded-[12px] ring-2 ring-white/80" />}
    </div>
  );
}

export default function OrganizerPage() {
  const [theme, setTheme] = useState<Theme>("light");
  const [tab, setTab] = useState<Tab>("arrange");
  const [basePath, setBasePath] = useState("/Users/Alex/Downloads");
  const [includeSub, setIncludeSub] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(MOCK_FILES.slice(0,8).map(f=>f.id)));
  const [previewFile, setPreviewFile] = useState<MockFile | null>(MOCK_FILES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDryRun, setShowDryRun] = useState(true);

  // Arrange state
  const [arrMode, setArrMode] = useState<ArrangeRule["mode"]>("type");
  const [dateField, setDateField] = useState<"created"|"modified">("modified");
  const [dateGroup, setDateGroup] = useState<"year"|"year-month"|"year-month-day"|"relative">("year-month");
  const [sizeRanges, setSizeRanges] = useState(DEFAULT_SIZE_RANGES);

  // Duplicates state
  const [dupCriteria, setDupCriteria] = useState({ hash:true, name:false, size:false, audioMeta:true, imageMeta:false, fuzzyName:false });
  const [dupSelected, setDupSelected] = useState<Set<string>>(new Set());
  const [dupAction, setDupAction] = useState<"delete"|"move">("move");

  // Rename state
  const [renamePattern, setRenamePattern] = useState("{name}_{num:03}");
  const [findStr, setFindStr] = useState("");
  const [replaceStr, setReplaceStr] = useState("");
  const [caseMode, setCaseMode] = useState<"keep"|"lower"|"upper"|"title"|"camel">("keep");
  const [numbering, setNumbering] = useState({ start:1, step:1, pad:3, enabled:true });

  // Folder styles
  const [activeStyle, setActiveStyle] = useState(FOLDER_STYLES[0].id);
  const [customColor, setCustomColor] = useState("#facc15");
  const [glassEnabled, setGlassEnabled] = useState(false);

  const files = MOCK_FILES;
  const selectedFiles = files.filter(f=> selectedIds.has(f.id));
  const allSelected = selectedIds.size===files.length;

  const arrangeRule: ArrangeRule = {
    id: "r1", mode: arrMode, dateField, dateGrouping: dateGroup, sizeRanges,
  };

  const previews = useMemo(()=> arrangePreview(selectedFiles.length? selectedFiles: files, basePath, arrangeRule, includeSub), [selectedFiles, basePath, arrangeRule, includeSub, files]);
  const summary = useMemo(()=> summarizePreview(previews), [previews]);
  const dupGroups = useMemo(()=> findDuplicates(selectedFiles.length? selectedFiles: files, dupCriteria), [selectedFiles, dupCriteria, files]);
  const totalWasted = dupGroups.reduce((s,g)=> s+g.wastedBytes, 0);

  const renameResults = useMemo(()=> applyRename(selectedFiles.length? selectedFiles: files.slice(0,10), {
    pattern: renamePattern, find: findStr, replace: replaceStr, caseMode, numbering, extensionMode:"keep"
  }), [selectedFiles, renamePattern, findStr, replaceStr, caseMode, numbering, files]);

  const t = THEMES[theme];
  const isDark = theme==="dark" || theme==="midnight";

  return (
    <div className={`min-h-screen ${t.bg} ${isDark?"text-white":"text-slate-900"} transition-colors`}>
      {/* Window chrome */}
      <div className={`sticky top-0 z-30 border-b ${isDark?"border-white/10 bg-[#0f1115]/80":"border-slate-200 bg-white/80"} backdrop-blur-xl`}>
        {/* macOS traffic lights + title */}
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded-full bg-[#ff5f56] shadow-inner ring-1 ring-black/10" />
            <span className="h-3.5 w-3.5 rounded-full bg-[#ffbd2e] shadow-inner ring-1 ring-black/10" />
            <span className="h-3.5 w-3.5 rounded-full bg-[#27c93f] shadow-inner ring-1 ring-black/10" />
          </div>
          <div className="ml-2 hidden items-center gap-2 text-xs font-medium opacity-60 sm:flex">
            <Monitor size={12} /> <span>Guzo Organizer — {basePath}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className={`hidden items-center gap-1 rounded-full border px-2 py-1 text-xs ${isDark?"border-white/10 bg-white/5":"border-slate-200 bg-slate-50"}`}>
              <ShieldCheck size={12} className="text-emerald-500" />
              <span className="font-semibold">Lightning fast • Rust core • Offline</span>
            </div>
            <Link href="/" className={`rounded-full px-3 py-1.5 text-xs font-semibold ${isDark?"bg-white text-black":"bg-slate-900 text-white"} hover:opacity-90`}>← Guzo Transit</Link>
            <div className={`flex items-center gap-1 rounded-full p-1 ${isDark?"bg-white/10":"bg-slate-100"}`}>
              {(Object.keys(THEMES) as Theme[]).map(th=>(
                <button key={th} onClick={()=>setTheme(th)} className={`h-6 rounded-full px-2.5 text-[11px] font-bold transition ${theme===th ? "bg-white text-slate-900 shadow" : isDark? "text-white/60 hover:text-white":"text-slate-500 hover:text-slate-900"}`}>
                  {THEMES[th].name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* App toolbar */}
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-2 px-4 pb-3">
          <div className="flex items-center gap-2">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20`}>
              <FileStack size={18} />
            </div>
            <div>
              <div className="text-sm font-bold leading-none tracking-tight">Guzo Organizer</div>
              <div className="text-[11px] font-medium opacity-60">v1.0 • Windows 10/11 • Standalone</div>
            </div>
            <span className="ml-2 hidden rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white sm:inline-flex">NEW</span>
          </div>

          <div className={`ml-auto flex w-full items-center gap-2 sm:w-auto ${isDark?"":""}`}>
            <label className={`flex flex-1 items-center gap-2 rounded-full border px-3 py-2 text-sm sm:w-[420px] ${isDark?"border-white/10 bg-white/5 placeholder:text-white/40":"border-slate-200 bg-white"}`}>
              <Search size={14} className="opacity-50" />
              <input placeholder="Search files, folders, rules…" className="w-full bg-transparent outline-none placeholder:text-slate-400" />
              <span className={`hidden rounded-full px-2 py-0.5 text-[10px] font-bold sm:inline-flex ${isDark?"bg-white/10":"bg-slate-100"}`}>⌘K</span>
            </label>
            <button className={`hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold sm:inline-flex ${isDark?"bg-white text-black":"bg-slate-900 text-white"}`}>
              <Download size={14} /> Export .exe
            </button>
          </div>
        </div>

        {/* Tab pills */}
        <div className="mx-auto flex max-w-[1600px] gap-1 overflow-auto px-4 pb-2 no-scrollbar">
          {[
            { id:"arrange", label:"Auto-Arrange", icon: Wand2, desc:"Smart folders", count: summary.length },
            { id:"duplicates", label:"Duplicate Finder", icon: Copy, desc:"AI + hash", count: dupGroups.length },
            { id:"rename", label:"Batch Rename", icon: Type, desc:"Multi-file", count: selectedFiles.length||files.length },
            { id:"styles", label:"Folder Styles", icon: Palette, desc:"Glass • macOS", count: FOLDER_STYLES.length },
            { id:"preview", label:"Preview", icon: Eye, desc:"Live", count: files.length },
          ].map(tap=>(
            <button key={tap.id} onClick={()=>setTab(tap.id as Tab)} className={`group flex shrink-0 items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 text-left transition ${tab===tap.id ? (isDark?"border-white bg-white text-black shadow":"border-slate-900 bg-slate-900 text-white shadow") : (isDark?"border-white/10 bg-white/5 hover:bg-white/10":"border-slate-200 bg-white hover:bg-slate-50")}`}>
              <span className={`grid h-8 w-8 place-items-center rounded-xl ${tab===tap.id?"bg-white/15":"bg-gradient-to-br from-violet-600 to-indigo-600 text-white"}`}>
                <tap.icon size={16} />
              </span>
              <span>
                <span className="block text-sm font-bold leading-none">{tap.label}</span>
                <span className={`block text-[11px] ${tab===tap.id?"opacity-70":"opacity-50"}`}>{tap.desc} • {tap.count}</span>
              </span>
              {tap.count>0 && <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab===tap.id?"bg-white text-slate-900":"bg-slate-900 text-white"}`}>{tap.count}</span>}
            </button>
          ))}
          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${isDark?"border-emerald-500/30 bg-emerald-500/15 text-emerald-300":"border-emerald-200 bg-emerald-50 text-emerald-700"}`}>● 28,492 files organized</span>
            <button className={`rounded-full p-2 ${isDark?"bg-white/10":"bg-slate-100"}`}><Settings2 size={14} /></button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-4 p-4 lg:gap-5">
        {/* Left: file browser / controls */}
        <div className="col-span-12 lg:col-span-3">
          <div className={`rounded-[20px] border ${isDark?"border-white/10 bg-[#1a1d24]":"border-slate-200 bg-white"} overflow-hidden shadow-sm`}>
            {/* path picker */}
            <div className={`border-b p-3 ${isDark?"border-white/10 bg-white/[0.03]":"border-slate-100 bg-slate-50/70"}`}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest opacity-60">Source Folder</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isDark?"bg-emerald-500/20 text-emerald-300":"bg-emerald-50 text-emerald-700"}`}>● Live watch</span>
              </div>
              <div className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 ${isDark?"border-white/10 bg-white/5":"border-slate-200 bg-white"}`}>
                <Folder size={14} className="text-amber-500" />
                <input value={basePath} onChange={e=>setBasePath(e.target.value)} className="w-full bg-transparent text-sm font-medium outline-none" />
                <button className={`rounded-full px-2.5 py-1 text-xs font-bold ${isDark?"bg-white text-black":"bg-slate-900 text-white"}`}>Browse</button>
              </div>
              <label className="mt-2 flex items-center gap-2 text-xs">
                <input type="checkbox" checked={includeSub} onChange={e=>setIncludeSub(e.target.checked)} className="rounded" />
                <span className="font-medium">Include subfolders</span>
                <span className="opacity-50">• {files.length} files</span>
              </label>
            </div>

            {/* file list */}
            <div className="max-h-[560px] overflow-auto p-2 scroll-thin">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-xs font-bold opacity-60">{selectedFiles.length? `${selectedFiles.length} selected`:`${files.length} files`}</span>
                <div className="flex items-center gap-1">
                  <button onClick={()=> setSelectedIds(new Set(files.map(f=>f.id)))} className={`rounded-full px-2 py-1 text-[11px] font-bold ${isDark?"bg-white/10":"bg-slate-100"}`}>Select all</button>
                  <button onClick={()=> setSelectedIds(new Set())} className={`rounded-full px-2 py-1 text-[11px] font-bold ${isDark?"bg-white/10":"bg-slate-100"}`}>Clear</button>
                </div>
              </div>
              <div className="grid gap-1">
                {files.map(f=>{
                  const sel = selectedIds.has(f.id);
                  const isPreview = previewFile?.id===f.id;
                  const k = KIND_CONFIG[f.kind];
                  return (
                    <button key={f.id} onClick={()=>{ setPreviewFile(f); setSelectedIds(prev=>{ const n=new Set(prev); if(n.has(f.id)) n.delete(f.id); else n.add(f.id); return n; }); }}
                      className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition ${sel? (isDark?"border-violet-500/40 bg-violet-500/10":"border-violet-200 bg-violet-50") : (isDark?"border-transparent hover:bg-white/5":"border-transparent hover:bg-slate-50")} ${isPreview?"ring-1 ring-violet-500/30":""}`}>
                      <span className={`grid h-8 w-8 place-items-center rounded-lg text-sm ${k.bg} text-white`}>{k.icon}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{f.name}</span>
                        <span className="block text-[11px] opacity-60">{humanSize(f.size)} • {new Date(f.modified).toLocaleDateString()} • {f.ext.toUpperCase()}</span>
                      </span>
                      <span className={`h-4 w-4 rounded-full border-2 grid place-items-center ${sel?"border-violet-600 bg-violet-600 text-white":"border-slate-300"}`}>
                        {sel && <Check size={10} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={`border-t p-3 ${isDark?"border-white/10":"border-slate-100"}`}>
              <div className={`rounded-xl p-2.5 ${isDark?"bg-white/5":"bg-slate-50"}`}>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Database size={12} /> Storage
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10">
                  <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-violet-600 to-indigo-600" />
                </div>
                <div className="mt-1 flex justify-between text-[11px] opacity-60">
                  <span>384 GB used</span><span>142 GB free</span>
                </div>
              </div>
            </div>
          </div>

          {/* quick stats */}
          <div className={`mt-4 grid grid-cols-3 gap-2`}>
            {[
              { label:"Images", v: files.filter(f=>f.kind==="image").length, c:"from-cyan-500 to-blue-500" },
              { label:"Audio", v: files.filter(f=>f.kind==="audio").length, c:"from-pink-500 to-rose-500" },
              { label:"Video", v: files.filter(f=>f.kind==="video").length, c:"from-violet-500 to-purple-600" },
            ].map(s=>(
              <div key={s.label} className={`rounded-2xl bg-gradient-to-br ${s.c} p-3 text-white shadow-lg`}>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">{s.label}</div>
                <div className="text-xl font-black">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: main workspace */}
        <div className="col-span-12 lg:col-span-6">
          {/* Arrange tab */}
          {tab==="arrange" && (
            <div className={`rounded-[20px] border ${isDark?"border-white/10 bg-[#1a1d24]":"border-slate-200 bg-white"} overflow-hidden shadow-sm`}>
              <div className="p-4 lg:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="flex items-center gap-2 text-lg font-black"><Wand2 size={18} className="text-violet-600" /> Auto-Arrange</h2>
                    <p className="text-sm opacity-60">Pick a rule — we’ll create folders & move files. Dry-run first, then commit.</p>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-semibold">
                    <input type="checkbox" checked={showDryRun} onChange={e=>setShowDryRun(e.target.checked)} /> Dry-run preview
                  </label>
                </div>

                {/* rule picker */}
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                  {[
                    { id:"type", label:"By Type", icon: LayoutGrid, desc:"Images / Audio …", color:"bg-blue-500" },
                    { id:"date", label:"By Date", icon: Calendar, desc:"Created / Modified", color:"bg-emerald-500" },
                    { id:"size", label:"By Size", icon: Ruler, desc:"Tiny → Huge", color:"bg-amber-500" },
                    { id:"similarity", label:"By Similarity", icon: Scan, desc:"Similar names", color:"bg-violet-500" },
                    { id:"extension", label:"By Extension", icon: Hash, desc:"JPG, MP3 …", color:"bg-pink-500" },
                  ].map(r=>(
                    <button key={r.id} onClick={()=>setArrMode(r.id as any)} className={`rounded-2xl border p-3 text-left transition ${arrMode===r.id? "border-slate-900 bg-slate-900 text-white shadow":"border-slate-200 bg-slate-50 hover:bg-white"}`}>
                      <span className={`grid h-8 w-8 place-items-center rounded-xl text-white ${r.color}`}><r.icon size={16} /></span>
                      <span className="mt-2 block text-sm font-bold">{r.label}</span>
                      <span className="block text-[11px] opacity-70">{r.desc}</span>
                    </button>
                  ))}
                </div>

                {/* sub-options */}
                <div className={`mt-4 rounded-2xl border p-3 ${isDark?"border-white/10 bg-white/5":"border-slate-200 bg-slate-50"}`}>
                  {arrMode==="date" && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold">Date field:</span>
                      <div className="flex gap-1">
                        {(["modified","created"] as const).map(f=>(
                          <button key={f} onClick={()=>setDateField(f)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${dateField===f?"bg-slate-900 text-white":"bg-white border border-slate-200"}`}>{f}</button>
                        ))}
                      </div>
                      <span className="text-xs font-bold">Group:</span>
                      <select value={dateGroup} onChange={e=>setDateGroup(e.target.value as any)} className="rounded-full border bg-white px-3 py-1.5 text-xs font-semibold">
                        <option value="year">Year</option>
                        <option value="year-month">Year-Month</option>
                        <option value="year-month-day">Year-Month-Day</option>
                        <option value="relative">Relative (Today/Week…)</option>
                      </select>
                    </div>
                  )}
                  {arrMode==="size" && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold">Size ranges (editable):</div>
                      <div className="grid gap-1">
                        {sizeRanges.map((r,i)=>(
                          <div key={r.label} className="flex items-center gap-2 rounded-xl bg-white px-2 py-1.5 text-xs">
                            <span className="h-2 w-2 rounded-full" style={{background:r.color}} />
                            <span className="w-[90px] font-bold">{r.label}</span>
                            <span className="opacity-60">{humanSize(r.min)} → {humanSize(r.max)}</span>
                            <span className="ml-auto text-[11px] opacity-50">{r.label==="Huge"? "∞":""}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {arrMode==="type" && (
                    <div className="text-xs leading-relaxed opacity-70">
                      Groups: <b>Images, Videos, Audio, Documents, Archives, Code, Others</b> — each gets its own folder. You can customize the mapping in Settings.
                    </div>
                  )}
                  {arrMode==="similarity" && (
                    <div className="text-xs opacity-70">AI clustering: files with similar stems (e.g. <code>vacation_photo_001.jpg</code> + <code>vacation_photo_001 (1).jpg</code>) are grouped. Threshold adjustable.</div>
                  )}
                  {arrMode==="extension" && <div className="text-xs opacity-70">Creates one folder per extension (JPG, MP3, PDF …).</div>}
                </div>

                {/* summary cards */}
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {summary.map(s=>{
                    const mainKind = s.files[0]?.file.kind as any;
                    return (
                      <div key={s.folder} className={`rounded-2xl border p-3 ${isDark?"border-white/10 bg-white/5":"border-slate-200 bg-white"} shadow-sm`}>
                        <div className="flex items-center gap-2">
                          <span className={`grid h-8 w-8 place-items-center rounded-xl text-white ${(mainKind && (KIND_CONFIG as any)[mainKind]) ? (KIND_CONFIG as any)[mainKind].bg:"bg-slate-500"}`}>📁</span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold">{s.folder.split("/").pop()}</span>
                            <span className="block text-xs opacity-60">{s.count} files • {humanSize(s.bytes)}</span>
                          </span>
                          <ChevronRight size={14} className="opacity-30" />
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {s.files.slice(0,4).map(f=>(
                            <span key={f.file.id} className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${isDark?"border-white/10":"border-slate-200 bg-slate-50"}`}>{f.file.name.slice(0,16)}</span>
                          ))}
                          {s.files.length>4 && <span className="text-[11px] opacity-50">+{s.files.length-4} more</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* preview list */}
                {showDryRun && (
                  <div className={`mt-4 rounded-2xl border ${isDark?"border-white/10":"border-slate-200"} overflow-hidden`}>
                    <div className={`flex items-center justify-between border-b px-3 py-2 ${isDark?"border-white/10 bg-white/5":"border-slate-100 bg-slate-50"}`}>
                      <span className="flex items-center gap-2 text-xs font-bold"><Eye size={12}/> Dry-run preview — {previews.length} moves</span>
                      <span className="text-[11px] opacity-60">Move • Keep structure • Auto-create folders</span>
                    </div>
                    <div className="max-h-[320px] overflow-auto divide-y divide-slate-100 dark:divide-white/5">
                      {previews.map(p=>(
                        <div key={p.file.id} className="flex items-center gap-2 px-3 py-2 text-xs">
                          <span className="min-w-0 flex-1 truncate opacity-70">{p.originalPath}</span>
                          <MoveRight size={12} className="shrink-0 opacity-40" />
                          <span className="min-w-0 flex-1 truncate font-semibold">{p.newPath}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow shadow-violet-600/20 hover:bg-violet-700">
                    <Zap size={16} /> Arrange {previews.length} files
                  </button>
                  <button className={`rounded-full border px-4 py-2.5 text-sm font-bold ${isDark?"border-white/15 bg-white/5":"border-slate-200 bg-white"}`}>Save as Rule</button>
                  <button className={`rounded-full border px-4 py-2.5 text-sm font-bold ${isDark?"border-white/15 bg-white/5":"border-slate-200 bg-white"}`}>Undo last</button>
                  <span className="ml-auto flex items-center gap-2 text-xs opacity-60"><Clock3 size={12}/> ~0.4s • Rust engine</span>
                </div>
              </div>
            </div>
          )}

          {tab==="duplicates" && (
            <div className={`rounded-[20px] border ${isDark?"border-white/10 bg-[#1a1d24]":"border-slate-200 bg-white"} overflow-hidden shadow-sm`}>
              <div className="p-4 lg:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 text-lg font-black"><Copy size={18} className="text-pink-600"/> Duplicate Finder</h2>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${humanSize(totalWasted)}`}>{humanSize(totalWasted)} reclaimable</span>
                </div>

                <div className={`mt-3 grid gap-2 rounded-2xl border p-3 ${isDark?"border-white/10 bg-white/5":"border-slate-200 bg-slate-50"}`}>
                  <div className="text-xs font-bold">Detection criteria (not just name):</div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {[
                      { k:"hash", label:"Exact hash (SHA256)", desc:"Bit-identical" },
                      { k:"audioMeta", label:"Audio fingerprint", desc:"Bitrate • Duration • SR" },
                      { k:"size", label:"Same size", desc:"Byte match" },
                      { k:"name", label:"Same name", desc:"Case-insensitive" },
                      { k:"fuzzyName", label:"Similar names", desc:"Levenshtein" },
                      { k:"imageMeta", label:"Image / EXIF", desc:"Dims + EXIF" },
                    ].map(c=>(
                      <label key={c.k} className={`flex items-center gap-2 rounded-xl border p-2.5 ${dupCriteria[c.k as keyof typeof dupCriteria] ? "border-violet-500 bg-violet-50":"border-slate-200 bg-white"}`}>
                        <input type="checkbox" checked={!!dupCriteria[c.k as keyof typeof dupCriteria]} onChange={e=> setDupCriteria(v=>({...v, [c.k]: e.target.checked}))} />
                        <span>
                          <span className="block text-xs font-bold">{c.label}</span>
                          <span className="block text-[11px] opacity-60">{c.desc}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold">Action:</span>
                    <button onClick={()=>setDupAction("move")} className={`rounded-full px-3 py-1 font-bold ${dupAction==="move"?"bg-slate-900 text-white":"bg-white border"}`}>Move to _Duplicates</button>
                    <button onClick={()=>setDupAction("delete")} className={`rounded-full px-3 py-1 font-bold ${dupAction==="delete"?"bg-red-600 text-white":"bg-white border"}`}>Delete duplicates</button>
                    <span className="opacity-60">• Keep newest • Smart select</span>
                  </div>
                </div>

                {dupGroups.length===0 ? (
                  <div className={`mt-4 rounded-2xl border border-dashed p-8 text-center ${isDark?"border-white/15 bg-white/5":"border-slate-300 bg-slate-50"}`}>
                    <Scan size={24} className="mx-auto opacity-40" />
                    <div className="mt-2 text-sm font-bold">No duplicates with current criteria</div>
                    <div className="text-xs opacity-60">Try enabling hash + audio fingerprint</div>
                  </div>
                ) : (
                  <div className="mt-4 grid gap-3">
                    {dupGroups.map(g=>{
                      const allIds = g.files.map(f=>f.id);
                      const allChosen = allIds.slice(1).every(id=> dupSelected.has(id));
                      return (
                        <div key={g.id} className={`rounded-2xl border ${isDark?"border-white/10 bg-white/[0.03]":"border-slate-200 bg-white"} overflow-hidden`}>
                          <div className={`flex items-center justify-between px-3 py-2 ${isDark?"bg-white/5":"bg-slate-50"}`}>
                            <div className="flex items-center gap-2">
                              <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${g.criteria.includes("hash")||g.criteria.includes("audioMeta")?"bg-emerald-500 text-white":"bg-amber-500 text-white"}`}>{g.reason}</span>
                              <span className="text-xs opacity-60">• {g.files.length} files • wasted {humanSize(g.wastedBytes)}</span>
                            </div>
                            <label className="flex items-center gap-1 text-xs font-bold">
                              <input type="checkbox" checked={allChosen} onChange={e=>{ const n=new Set(dupSelected); if(e.target.checked) allIds.slice(1).forEach(id=> n.add(id)); else allIds.slice(1).forEach(id=> n.delete(id)); setDupSelected(n); }} />
                              Auto-select duplicates
                            </label>
                          </div>
                          <div className="divide-y divide-slate-100 dark:divide-white/5">
                            {g.files.map((f,i)=>(
                              <div key={f.id} className={`flex items-center gap-3 px-3 py-2 ${i===0?"bg-emerald-50/50":""}`}>
                                <input type="checkbox" disabled={i===0 && g.files.length>1} checked={i===0? false: dupSelected.has(f.id)} onChange={e=>{
                                  const n=new Set(dupSelected); if(e.target.checked) n.add(f.id); else n.delete(f.id); setDupSelected(n);
                                }} />
                                <span className={`grid h-8 w-8 place-items-center rounded-lg text-white ${KIND_CONFIG[f.kind].bg} text-sm`}>{KIND_CONFIG[f.kind].icon}</span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-sm font-semibold">{f.name} {i===0 && <span className="ml-1 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">KEEP</span>}</span>
                                  <span className="block text-[11px] opacity-60">{humanSize(f.size)} • {f.bitrate? `${f.bitrate}kbps • ${f.duration}s`:""} {f.width? `${f.width}×${f.height}`:""} • {new Date(f.modified).toLocaleDateString()}</span>
                                </span>
                                <button onClick={()=>setPreviewFile(f)} className={`rounded-full border px-2.5 py-1 text-xs font-bold ${isDark?"border-white/15":"border-slate-200 bg-white"}`}>Preview</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-pink-700">
                    <Trash2 size={16} /> {dupAction==="delete"?"Delete":"Move"} {dupSelected.size} duplicates • free {humanSize(Array.from(dupSelected).reduce((s,id)=> s+(files.find(f=>f.id===id)?.size||0),0))}
                  </button>
                  <button className={`rounded-full border px-4 py-2.5 text-sm font-bold ${isDark?"border-white/15 bg-white/5":"border-slate-200 bg-white"}`}>Keep largest only</button>
                  <button className={`rounded-full border px-4 py-2.5 text-sm font-bold ${isDark?"border-white/15 bg-white/5":"border-slate-200 bg-white"}`}>Keep newest only</button>
                </div>
              </div>
            </div>
          )}

          {tab==="rename" && (
            <div className={`rounded-[20px] border ${isDark?"border-white/10 bg-[#1a1d24]":"border-slate-200 bg-white"} overflow-hidden shadow-sm`}>
              <div className="p-4 lg:p-5">
                <h2 className="flex items-center gap-2 text-lg font-black"><Type size={18} className="text-blue-600"/> Batch Rename</h2>
                <p className="text-sm opacity-60">Pattern, find/replace, numbering, case — live preview before you commit.</p>

                <div className={`mt-4 grid gap-3 rounded-2xl border p-3 ${isDark?"border-white/10 bg-white/5":"border-slate-200 bg-slate-50"}`}>
                  <label className="grid gap-1">
                    <span className="text-xs font-bold">Name pattern <span className="font-normal opacity-60">— use {"{name}"}, {"{num:03}"}, {"{date}"}, {"{kind}"}</span></span>
                    <input value={renamePattern} onChange={e=>setRenamePattern(e.target.value)} className={`rounded-xl border px-3 py-2 font-mono text-sm ${isDark?"border-white/10 bg-white/5":"border-slate-200 bg-white"}`} placeholder="{name}_{num:03}" />
                    <span className="text-[11px] opacity-60">Examples: <code>{"{name}_{num:03}"}</code> • <code>{"IMG_{date}_{num}"}</code> • <code>{"{kind}_{name}"}</code></span>
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="grid gap-1">
                      <span className="text-xs font-bold">Find</span>
                      <input value={findStr} onChange={e=>setFindStr(e.target.value)} className={`rounded-xl border px-3 py-2 text-sm ${isDark?"border-white/10 bg-white/5":"border-slate-200 bg-white"}`} placeholder="e.g. IMG_" />
                    </label>
                    <label className="grid gap-1">
                      <span className="text-xs font-bold">Replace</span>
                      <input value={replaceStr} onChange={e=>setReplaceStr(e.target.value)} className={`rounded-xl border px-3 py-2 text-sm ${isDark?"border-white/10 bg-white/5":"border-slate-200 bg-white"}`} placeholder="Photo_" />
                    </label>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold">Case:</span>
                    {(["keep","lower","upper","title","camel"] as const).map(c=>(
                      <button key={c} onClick={()=>setCaseMode(c)} className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${caseMode===c?"bg-slate-900 text-white":"bg-white border"}`}>{c}</button>
                    ))}
                    <label className="ml-auto flex items-center gap-2 text-xs font-bold">
                      <input type="checkbox" checked={numbering.enabled} onChange={e=>setNumbering(v=>({...v, enabled:e.target.checked}))} /> Numbering
                    </label>
                    {numbering.enabled && (
                      <div className="flex items-center gap-1">
                        <input type="number" value={numbering.start} onChange={e=>setNumbering(v=>({...v, start: Number(e.target.value)}))} className="w-16 rounded-full border bg-white px-2 py-1 text-xs" />
                        <span className="text-xs opacity-60">step</span>
                        <input type="number" value={numbering.step} onChange={e=>setNumbering(v=>({...v, step: Number(e.target.value)}))} className="w-16 rounded-full border bg-white px-2 py-1 text-xs" />
                        <span className="text-xs opacity-60">pad</span>
                        <input type="number" value={numbering.pad} onChange={e=>setNumbering(v=>({...v, pad: Number(e.target.value)}))} className="w-14 rounded-full border bg-white px-2 py-1 text-xs" />
                      </div>
                    )}
                  </div>
                </div>

                <div className={`mt-4 overflow-hidden rounded-2xl border ${isDark?"border-white/10":"border-slate-200"}`}>
                  <div className={`grid grid-cols-[1fr_1fr] gap-px ${isDark?"bg-white/10":"bg-slate-200"}`}>
                    <div className={`px-3 py-2 text-xs font-bold ${isDark?"bg-white/5":"bg-slate-50"}`}>Original</div>
                    <div className={`px-3 py-2 text-xs font-bold ${isDark?"bg-white/5":"bg-slate-50"}`}>New name • preview</div>
                  </div>
                  <div className="max-h-[420px] overflow-auto divide-y divide-slate-100 dark:divide-white/5">
                    {renameResults.map(r=>(
                      <div key={r.file.id} className="grid grid-cols-[1fr_1fr] gap-px bg-slate-100 dark:bg-white/5">
                        <div className={`truncate px-3 py-2 text-sm ${isDark?"bg-[#1a1d24]":"bg-white"} opacity-70`}>{r.file.name}</div>
                        <div className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold ${isDark?"bg-[#1a1d24]":"bg-white"} text-emerald-600`}>
                          <ArrowRight size={12} className="opacity-40" /> {r.newName}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-blue-700"><RefreshCw size={16}/> Apply rename</button>
                  <button className={`rounded-full border px-4 py-2.5 text-sm font-bold ${isDark?"border-white/15 bg-white/5":"border-slate-200 bg-white"}`}>Export CSV</button>
                  <button className={`rounded-full border px-4 py-2.5 text-sm font-bold ${isDark?"border-white/15 bg-white/5":"border-slate-200 bg-white"}`}>Undo</button>
                </div>
              </div>
            </div>
          )}

          {tab==="styles" && (
            <div className={`rounded-[20px] border ${isDark?"border-white/10 bg-[#1a1d24]":"border-slate-200 bg-white"} overflow-hidden shadow-sm`}>
              <div className="p-4 lg:p-5">
                <h2 className="flex items-center gap-2 text-lg font-black"><Palette size={18} className="text-amber-600"/> Folder Styles</h2>
                <p className="text-sm opacity-60">Color, glass, macOS, neon — apply to any folder via <code>desktop.ini</code> on Windows.</p>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {FOLDER_STYLES.map(s=>(
                    <button key={s.id} onClick={()=>setActiveStyle(s.id)} className={`rounded-2xl border p-3 text-left transition ${activeStyle===s.id?"border-slate-900 bg-slate-50 ring-2 ring-slate-900/10":"border-slate-200 bg-white hover:bg-slate-50"}`}>
                      <FolderIcon style={s} size={56} active={activeStyle===s.id} />
                      <div className="mt-2 text-sm font-bold">{s.name}</div>
                      <div className="text-[11px] opacity-60">{s.glass?"Acrylic glass":"Solid"} • {s.icon}</div>
                      <div className="mt-2 h-1.5 w-full rounded-full" style={{background:s.color}} />
                    </button>
                  ))}
                </div>

                <div className={`mt-4 grid gap-3 rounded-2xl border p-4 ${isDark?"border-white/10 bg-white/5":"border-slate-200 bg-slate-50"}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold">Custom color</span>
                    <input type="color" value={customColor} onChange={e=>setCustomColor(e.target.value)} className="h-8 w-12 rounded-full border" />
                    <span className="text-xs opacity-60">{customColor}</span>
                    <label className="ml-auto flex items-center gap-2 text-xs font-bold">
                      <input type="checkbox" checked={glassEnabled} onChange={e=>setGlassEnabled(e.target.checked)} /> Glass effect
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="grid h-20 w-24 place-items-center rounded-2xl border border-slate-200 bg-white shadow-sm" style={{ background: glassEnabled ? `linear-gradient(180deg, ${customColor} 0%, rgba(255,255,255,0.5) 100%)` : customColor }}>
                      <FolderIcon style={{...FOLDER_STYLES[0], color: customColor, glass: glassEnabled, accent: customColor } as any} size={48} />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold">Live preview</div>
                      <div className="opacity-60">Will write <code>desktop.ini</code> + colored <code>.ico</code> overlay.<br/>Works on Windows 10/11 — Explorer shows instantly.</div>
                    </div>
                  </div>
                </div>

                <div className={`mt-4 rounded-2xl border p-3 ${isDark?"border-white/10 bg-white/5":"border-slate-200 bg-white"}`}>
                  <div className="flex items-center gap-2 text-xs font-bold"><Paintbrush size={12}/> How it works on Windows</div>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs opacity-70">
                    <li>Pick target folder (or create new one during Arrange).</li>
                    <li>Choose style — we generate a tinted icon + <code>desktop.ini</code> with <code>IconResource</code>.</li>
                    <li>Explorer refreshes: folder shows your color/emoji overlay. Glass uses translucent icon with acrylic blur.</li>
                    <li>Bulk apply: select many folders → one click. Undo restores default.</li>
                  </ol>
                  <div className={`mt-3 rounded-xl p-2.5 font-mono text-[11px] ${isDark?"bg-white/5":"bg-slate-50"}`}>
                    [.ShellClassInfo]<br/>IconResource=C:\Icons\guzo_{activeStyle}.ico,0<br/>InfoTip=Guzo Organizer • {FOLDER_STYLES.find(f=>f.id===activeStyle)?.name}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-amber-600"><Paintbrush size={16}/> Apply to {basePath.split("/").pop()}</button>
                  <button className="rounded-full border bg-white px-4 py-2.5 text-sm font-bold">Apply to all new folders</button>
                  <button className="rounded-full border bg-white px-4 py-2.5 text-sm font-bold">Reset to default</button>
                </div>
              </div>
            </div>
          )}

          {tab==="preview" && (
            <div className={`rounded-[20px] border ${isDark?"border-white/10 bg-[#1a1d24]":"border-slate-200 bg-white"} overflow-hidden shadow-sm`}>
              <div className="p-4 lg:p-5">
                <h2 className="flex items-center gap-2 text-lg font-black"><Eye size={18} className="text-cyan-600"/> Live Preview</h2>
                <p className="text-sm opacity-60">Audio, image, video, docs — quick-look without opening another app.</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {files.slice(0,9).map(f=>(
                    <button key={f.id} onClick={()=>setPreviewFile(f)} className={`group overflow-hidden rounded-2xl border text-left ${previewFile?.id===f.id?"border-violet-500 ring-2 ring-violet-500/20":"border-slate-200 hover:border-slate-300"}`}>
                      <div className={`grid h-24 place-items-center text-2xl ${f.kind==="image"?"bg-gradient-to-br from-cyan-500 to-blue-600": f.kind==="audio"?"bg-gradient-to-br from-pink-500 to-rose-600": f.kind==="video"?"bg-gradient-to-br from-violet-600 to-indigo-600": f.kind==="document"?"bg-gradient-to-br from-blue-500 to-cyan-600":"bg-gradient-to-br from-slate-700 to-slate-900"} text-white`}>
                        {f.kind==="image" ? "🖼️" : f.kind==="audio" ? "🎵" : f.kind==="video" ? "🎬" : f.kind==="document" ? "📄" : f.kind==="archive" ? "📦" : "💻"}
                      </div>
                      <div className={`p-2.5 ${isDark?"bg-[#1a1d24]":"bg-white"}`}>
                        <div className="truncate text-sm font-bold">{f.name}</div>
                        <div className="text-xs opacity-60">{humanSize(f.size)} • {f.kind}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className={`mt-4 rounded-2xl border p-3 ${isDark?"border-white/10 bg-white/5":"border-slate-200 bg-slate-50"}`}>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Zap size={12} className="text-amber-500"/> Tip: Select any file on the left to preview it on the right → audio waveform, image zoom, video scrubber, code syntax.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: preview / details */}
        <div className="col-span-12 lg:col-span-3">
          <div className={`sticky top-[148px] rounded-[20px] border ${isDark?"border-white/10 bg-[#1a1d24]":"border-slate-200 bg-white"} overflow-hidden shadow-sm`}>
            <div className={`flex items-center justify-between border-b px-3 py-2.5 ${isDark?"border-white/10 bg-white/[0.03]":"border-slate-100 bg-slate-50"}`}>
              <span className="flex items-center gap-2 text-xs font-bold"><Eye size={14}/> Preview</span>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${previewFile ? "bg-violet-600 text-white":"bg-slate-200"}`}>{previewFile? previewFile.kind:"—"}</span>
            </div>

            {!previewFile ? (
              <div className="p-8 text-center text-sm opacity-60">Select a file to preview</div>
            ) : (
              <div>
                {/* media area */}
                <div className="p-3">
                  {previewFile.kind==="image" ? (
                    <div className={`grid h-[220px] place-items-center overflow-hidden rounded-2xl border ${isDark?"border-white/10":"border-slate-200"} bg-gradient-to-br from-slate-900 to-black text-white`}>
                      <div className="text-center">
                        <div className="text-4xl">🖼️</div>
                        <div className="mt-2 text-xs font-bold">{previewFile.name}</div>
                        <div className="text-[11px] opacity-60">{previewFile.width}×{previewFile.height} • {humanSize(previewFile.size)}</div>
                        <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-white/20">
                          <div className="h-full w-[70%] rounded-full bg-white" />
                        </div>
                        <div className="mt-1 text-[10px] opacity-50">100% • pinch to zoom</div>
                      </div>
                    </div>
                  ) : previewFile.kind==="audio" ? (
                    <div className={`rounded-2xl border p-3 ${isDark?"border-white/10 bg-white/5":"border-slate-200 bg-slate-50"}`}>
                      <div className="flex items-center gap-3">
                        <button onClick={()=>setIsPlaying(v=>!v)} className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-white">
                          {isPlaying? <Pause size={16}/> : <Play size={16} className="ml-0.5" />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-bold">{previewFile.name}</div>
                          <div className="text-xs opacity-60">{previewFile.bitrate} kbps • {previewFile.duration}s • {previewFile.sampleRate} Hz</div>
                        </div>
                      </div>
                      {/* waveform */}
                      <div className="mt-3 flex h-10 items-end gap-[2px]">
                        {Array.from({length: 42}).map((_,i)=>(
                          <div key={i} className={`w-[4px] rounded-full ${isPlaying?"bg-violet-600":"bg-slate-300"} transition-all`} style={{ height: `${12+ Math.abs(Math.sin(i*0.8))*28}px`, opacity: isPlaying? 0.9:0.6 }} />
                        ))}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <SkipBack size={14} className="opacity-60" />
                        <div className="h-1 flex-1 rounded-full bg-slate-200">
                          <div className="h-full w-[42%] rounded-full bg-violet-600" />
                        </div>
                        <SkipForward size={14} className="opacity-60" />
                        <Volume2 size={14} className="opacity-60" />
                      </div>
                    </div>
                  ) : previewFile.kind==="video" ? (
                    <div className="overflow-hidden rounded-2xl bg-black">
                      <div className="grid h-[160px] place-items-center text-white">
                        <div className="text-center">
                          <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-white/15"><Play size={18} /></div>
                          <div className="mt-2 text-xs font-bold">{previewFile.name}</div>
                          <div className="text-[11px] opacity-60">1080p • 60fps • {humanSize(previewFile.size)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 px-2 py-1.5 text-white">
                        <span className="text-[11px]">02:14</span>
                        <div className="h-1 flex-1 rounded-full bg-white/20"><div className="h-full w-[36%] rounded-full bg-white" /></div>
                        <span className="text-[11px]">05:42</span>
                      </div>
                    </div>
                  ) : (
                    <div className={`rounded-2xl border p-4 font-mono text-xs leading-relaxed ${isDark?"border-white/10 bg-white/5":"border-slate-200 bg-white"}`}>
                      <div className="mb-2 flex items-center gap-2 text-[11px] font-bold opacity-60"><FileText size={12}/> {previewFile.name}</div>
                      <div className="opacity-80">
                        {previewFile.kind==="code" ? `// ${previewFile.name}\nimport { arrange } from "./engine";\nexport function preview() {\n  return organize(files);\n}` : `Lorem ipsum dolor sit amet — preview of ${previewFile.name}.\nSize: ${humanSize(previewFile.size)}\nModified: ${new Date(previewFile.modified).toLocaleString()}\nPath: ${previewFile.path}\n\nQuick-look supports PDF, DOCX, TXT, MD, JSON, etc.`}
                      </div>
                    </div>
                  )}

                  {/* details */}
                  <div className={`mt-3 rounded-2xl border p-3 ${isDark?"border-white/10 bg-white/5":"border-slate-200 bg-slate-50"}`}>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="opacity-60">Size</span><div className="font-bold">{humanSize(previewFile.size)}</div></div>
                      <div><span className="opacity-60">Type</span><div className="font-bold">{previewFile.ext.toUpperCase()} • {previewFile.kind}</div></div>
                      <div><span className="opacity-60">Created</span><div className="font-bold">{new Date(previewFile.created).toLocaleDateString()}</div></div>
                      <div><span className="opacity-60">Modified</span><div className="font-bold">{new Date(previewFile.modified).toLocaleDateString()}</div></div>
                      {previewFile.bitrate && <div><span className="opacity-60">Bitrate</span><div className="font-bold">{previewFile.bitrate} kbps</div></div>}
                      {previewFile.duration && <div><span className="opacity-60">Duration</span><div className="font-bold">{previewFile.duration}s</div></div>}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 rounded-full bg-slate-900 py-2 text-xs font-bold text-white">Open</button>
                      <button className="flex-1 rounded-full border bg-white py-2 text-xs font-bold">Reveal in Explorer</button>
                    </div>
                  </div>

                  {/* folder style preview inline */}
                  <div className={`mt-3 rounded-2xl border p-3 ${isDark?"border-white/10 bg-white/5":"border-slate-200 bg-white"}`}>
                    <div className="flex items-center gap-2 text-xs font-bold"><Palette size={12}/> Folder style</div>
                    <div className="mt-2 flex items-center gap-2">
                      {FOLDER_STYLES.slice(0,5).map(s=>(
                        <div key={s.id} className="grid place-items-center">
                          <FolderIcon style={s} size={36} />
                          <span className="mt-1 text-[10px] opacity-60">{s.name.split(" ")[0]}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={()=>setTab("styles")} className="mt-2 w-full rounded-full bg-white px-3 py-1.5 text-xs font-bold shadow-sm">Customize →</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* mini help */}
          <div className={`mt-4 rounded-[20px] border p-3 ${isDark?"border-white/10 bg-white/5":"border-slate-200 bg-white"} shadow-sm`}>
            <div className="flex items-center gap-2 text-xs font-bold"><Sparkles size={12} className="text-violet-600"/> How to install on Windows</div>
            <ol className="mt-2 space-y-1 text-xs opacity-70">
              <li>1. Click <b>Export .exe</b> (or build from source).</li>
              <li>2. Run <code>GuzoOrganizer-Setup.exe</code> — no admin needed (portable).</li>
              <li>3. Pick folder → choose rule → dry-run → Arrange.</li>
              <li>4. Duplicates & Batch Rename are instant, with undo.</li>
            </ol>
            <div className={`mt-2 rounded-xl p-2 text-[11px] ${isDark?"bg-white/5":"bg-violet-50"}`}>
              <b>Rust core:</b> <code>walkdir + rayon</code> scans 100k files in ~2s, SHA256 in parallel. UI is Tauri (webview) — light, no Electron bloat.
            </div>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className={`mx-auto flex max-w-[1600px] flex-wrap items-center gap-2 px-4 pb-6`}>
        <div className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs ${isDark?"border-white/10 bg-white/5":"border-slate-200 bg-white"}`}>
          <HardDrive size={12} /> <span className="font-bold">Engine:</span> Rust • Tauri 2.0 • Windows 10/11
          <span className="mx-2 h-3 w-px bg-slate-200" />
          <span className="opacity-60">Standalone • Portable • Offline • 12 MB installer</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className={`rounded-full px-3 py-2 text-xs font-bold ${isDark?"bg-white text-black":"bg-slate-900 text-white"}`}>⭐ 4.9/5 on GitHub</span>
          <button className={`rounded-full border px-4 py-2 text-xs font-bold ${isDark?"border-white/10 bg-white/5":"border-slate-200 bg-white"}`}>View Rust source →</button>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display:none; }
        .no-scrollbar { scrollbar-width:none; }
        .scroll-thin::-webkit-scrollbar { width:6px; height:6px; }
        .scroll-thin::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius:999px; }
      `}</style>
    </div>
  );
}
