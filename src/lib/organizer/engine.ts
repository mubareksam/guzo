import { MockFile, ArrangeRule, OrganizePreview, DuplicateGroup, RenameRule, humanSize } from "./types";

// ── Arrange ──────────────────────────────────────────────────────
export function arrangePreview(files: MockFile[], basePath: string, rule: ArrangeRule, includeSubfolders=false): OrganizePreview[] {
  return files.map(f => {
    let subfolder = "Others";
    if (rule.mode==="date") {
      const iso = rule.dateField==="created" ? f.created : f.modified;
      const d = new Date(iso);
      if (rule.dateGrouping==="year") subfolder = `${d.getFullYear()}`;
      else if (rule.dateGrouping==="year-month") subfolder = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
      else if (rule.dateGrouping==="year-month-day") subfolder = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      else if (rule.dateGrouping==="relative") {
        const diff = Math.floor((Date.now()-d.getTime())/86400000);
        if (diff===0) subfolder="Today";
        else if (diff===1) subfolder="Yesterday";
        else if (diff<7) subfolder="This Week";
        else if (diff<30) subfolder="This Month";
        else subfolder="Older";
      }
    } else if (rule.mode==="type") {
      subfolder = f.kind.charAt(0).toUpperCase()+f.kind.slice(1)+"s";
      if (f.kind==="other") subfolder = `_${f.ext.toUpperCase()||"OTHER"}`;
    } else if (rule.mode==="extension") {
      subfolder = f.ext ? f.ext.toUpperCase() : "NO_EXT";
    } else if (rule.mode==="size") {
      const ranges = rule.sizeRanges!;
      const r = ranges.find(x=> f.size>=x.min && f.size < x.max) || ranges[ ranges.length-1 ];
      subfolder = `${r.label} (${humanSize(r.min)} - ${humanSize(r.max)})`;
    } else if (rule.mode==="similarity") {
      // group by normalized name stem: remove numbers, copy markers
      const stem = f.name.toLowerCase().replace(/[\s_\-()]+/g," ").replace(/\s*\(copy\)|\s*\(\d+\)|\s*copy|\s*final\d*/g,"").trim().split(" ")[0] || f.name.slice(0,6);
      subfolder = stem.charAt(0).toUpperCase()+stem.slice(1);
      if (!subfolder) subfolder="Misc";
    } else if (rule.mode==="name") {
      const p = rule.namePattern || "^[A-Za-z]";
      try {
        const re = new RegExp(p,"i");
        const m = f.name.match(re);
        subfolder = m ? m[0].trim().charAt(0).toUpperCase() : "#";
      } catch { subfolder = f.name.charAt(0).toUpperCase(); }
    }

    // sanitize
    subfolder = subfolder.replace(/[<>:"/\\|?*]/g,"_").slice(0,80);
    const newFolder = `${basePath}/${subfolder}`;
    return { originalPath: f.path, newPath: `${newFolder}/${f.name}`, newFolder, file: f };
  });
}

export function summarizePreview(previews: OrganizePreview[]) {
  const map = new Map<string, number>();
  const sizeMap = new Map<string, number>();
  for (const p of previews) {
    map.set(p.newFolder, (map.get(p.newFolder)||0)+1);
    sizeMap.set(p.newFolder, (sizeMap.get(p.newFolder)||0)+p.file.size);
  }
  return Array.from(map.entries()).map(([folder,count])=>({ folder, count, bytes: sizeMap.get(folder)!, files: previews.filter(p=>p.newFolder===folder) }));
}

// ── Duplicates ───────────────────────────────────────────────────
export type DupCriteria = {
  hash?: boolean;
  name?: boolean;
  size?: boolean;
  audioMeta?: boolean;
  imageMeta?: boolean;
  fuzzyName?: boolean;
};

export function findDuplicates(files: MockFile[], criteria: DupCriteria): DuplicateGroup[] {
  const groups: DuplicateGroup[] = [];
  const used = new Set<string>();

  if (criteria.hash) {
    const byHash = new Map<string, MockFile[]>();
    for (const f of files) {
      const h = f.hash || f.size.toString();
      byHash.set(h, [...(byHash.get(h)||[]), f]);
    }
    for (const [h, list] of byHash) {
      if (list.length>1) {
        groups.push({ id: `hash-${h}`, reason: "Identical content (hash)", criteria: ["hash"], files: list, wastedBytes: list.slice(1).reduce((s,f)=>s+f.size,0) });
        list.forEach(f=> used.add(f.id));
      }
    }
  }

  if (criteria.name) {
    const byName = new Map<string, MockFile[]>();
    for (const f of files.filter(f=>!used.has(f.id))) {
      const key = f.name.toLowerCase();
      byName.set(key, [...(byName.get(key)||[]), f]);
    }
    for (const [n,list] of byName) if (list.length>1) {
      groups.push({ id:`name-${n}`, reason:"Same filename", criteria:["name"], files:list, wastedBytes: list.slice(1).reduce((s,f)=>s+f.size,0) });
    }
  }

  if (criteria.size) {
    const bySize = new Map<number, MockFile[]>();
    for (const f of files) {
      const k = f.size;
      bySize.set(k, [...(bySize.get(k)||[]), f]);
    }
    for (const [sz,list] of bySize) if (list.length>1 && list.some(f=>!used.has(f.id))) {
      // only if not already grouped entirely
      const notUsed = list.filter(f=> !groups.some(g=>g.files.includes(f)));
      if (notUsed.length>1) groups.push({ id:`size-${sz}`, reason:`Same size (${humanSize(sz)})`, criteria:["size"], files:list, wastedBytes: list.slice(1).reduce((s,f)=>s+f.size,0) });
    }
  }

  if (criteria.audioMeta) {
    const audio = files.filter(f=>f.kind==="audio");
    const map = new Map<string, MockFile[]>();
    for (const f of audio) {
      const key = `${f.bitrate}|${f.duration}|${f.sampleRate}`;
      map.set(key, [...(map.get(key)||[]), f]);
    }
    for (const [k,list] of map) if (list.length>1) {
      if (groups.some(g=> list.every(f=> g.files.includes(f)))) continue;
      groups.push({ id:`audio-${k}`, reason:`Audio match — ${k.replaceAll("|"," • ")} • bitrate/duration/sampleRate`, criteria:["audioMeta"], files:list, wastedBytes: list.slice(1).reduce((s,f)=>s+f.size,0) });
    }
  }

  if (criteria.fuzzyName) {
    // group by stem
    const stems = new Map<string, MockFile[]>();
    for (const f of files) {
      const stem = f.name.toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,8);
      stems.set(stem, [...(stems.get(stem)||[]), f]);
    }
    for (const [s,list] of stems) if (list.length>1) {
      const already = groups.some(g=> list.every(f=> g.files.includes(f)));
      if (already) continue;
      // simple levenshtein check: if names share 70% chars
      const uniq = list.filter((f,i,a)=> a.findIndex(x=>x.name===f.name)===i);
      if (uniq.length>1) groups.push({ id:`fuzzy-${s}`, reason:"Similar names (fuzzy)", criteria:["fuzzyName"], files:list, wastedBytes: list.slice(1).reduce((s,f)=>s+f.size,0) });
    }
  }

  // de-dup groups by same file sets
  const seen = new Set<string>();
  return groups.filter(g=>{
    const key = g.files.map(f=>f.id).sort().join(",");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Batch rename ─────────────────────────────────────────────────
export function applyRename(files: MockFile[], rule: RenameRule): { file: MockFile; newName: string; newPath: string }[] {
  return files.map((f, idx)=>{
    const dot = f.name.lastIndexOf(".");
    const base = dot===-1? f.name : f.name.slice(0,dot);
    const ext = dot===-1? "" : f.name.slice(dot+1);

    let out = rule.pattern || "{name}";

    // numbering
    if (rule.numbering?.enabled) {
      const n = rule.numbering.start + idx*rule.numbering.step;
      const padded = String(n).padStart(rule.numbering.pad, "0");
      out = out.replaceAll("{num}", padded).replaceAll("{n}", padded);
      out = out.replaceAll(/\{num:(\d+)\}/g, (_,p)=> String(n).padStart(Number(p),"0"));
    }
    out = out.replaceAll("{name}", base);
    out = out.replaceAll("{ext}", ext);
    out = out.replaceAll("{kind}", f.kind);
    out = out.replaceAll("{date}", new Date(f.modified).toISOString().slice(0,10));

    // prefix/suffix
    if (rule.prefix) out = rule.prefix + out;
    if (rule.suffix) out = out + rule.suffix;

    // find/replace
    if (rule.find) {
      if (rule.useRegex) {
        try { const re = new RegExp(rule.find,"g"); out = out.replace(re, rule.replace||""); } catch{}
      } else {
        out = out.split(rule.find).join(rule.replace||"");
      }
    }

    // case
    if (rule.caseMode==="lower") out = out.toLowerCase();
    else if (rule.caseMode==="upper") out = out.toUpperCase();
    else if (rule.caseMode==="title") out = out.replace(/\w\S*/g, w=> w.charAt(0).toUpperCase()+w.slice(1).toLowerCase());
    else if (rule.caseMode==="camel") out = out.replace(/[^a-zA-Z0-9]+(.)/g, (_,c)=> c.toUpperCase()).replace(/^./, s=> s.toLowerCase());

    // extension handling
    let finalExt = ext;
    if (rule.extensionMode==="lower") finalExt = ext.toLowerCase();
    else if (rule.extensionMode==="upper") finalExt = ext.toUpperCase();
    else if (rule.extensionMode==="custom" && rule.customExt) finalExt = rule.customExt.replace(".","");

    let newName = finalExt ? `${out}.${finalExt}` : out;
    // sanitize
    newName = newName.replace(/[<>:"/\\|?*]/g,"_");
    if (!newName.trim()) newName = f.name;

    return { file: f, newName, newPath: `${f.folder}/${newName}` };
  });
}
