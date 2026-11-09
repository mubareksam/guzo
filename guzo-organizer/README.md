# Guzo Organizer — Windows File Organizer

**Fast • Lightweight • Offline • Rust + Tauri**

A standalone Windows app that automatically organizes files — choose any folder/subfolder, it creates folders by itself and lets you control *how*:

### Features

**1. Auto-Arrange**
- **By date**: created / modified → grouped by Year, Year-Month, Year-Month-Day, or relative (Today/Yesterday/This Week/This Month/Older)
- **By type**: Images, Videos, Audio, Documents, Archives, Code, Others (customizable mapping)
- **By extension**: one folder per extension (JPG, MP3, PDF…)
- **By size**: Tiny (<1 MB) • Small (1-10 MB) • Medium (10-100 MB) • Large (100 MB-1 GB) • Huge (>1 GB) — fully editable ranges
- **By similarity**: AI grouping — similar names/content together (e.g. `vacation_001.jpg` + `vacation_001 (1).jpg`)
- **By name pattern**: regex
- Preview (dry-run) → Move/Copy with auto-rename on conflict, recursive subfolder support, undo.

**2. Duplicate Finder (not just by name)**
- Exact hash (SHA256/blake3, parallel with rayon)
- Audio: bitrate + duration + sampleRate (via `lofty`)
- Image: dimensions + EXIF
- Same size, same name (case-insensitive), fuzzy name (Levenshtein via `strsim`)
- Groups with “keep newest/largest” + bulk delete / move to `_Duplicates` • reclaimable space shown.

**3. Batch Rename**
- Pattern: `{name}`, `{num:03}`, `{date}`, `{kind}`, prefix/suffix
- Find→Replace (plain or regex), case modes (keep/lower/upper/title/camel)
- Numbering: start/step/pad, live preview table, undo.

**4. Folder Styles**
- Windows `desktop.ini` + tinted `.ico` overlay — Explorer shows instantly.
- Presets: Windows Default, macOS, **Glass/Acrylic** (translucent), Neon, Forest, Sunset, Ocean, Amber
- Custom color + glass toggle, bulk apply, reset to default.
- No admin needed — sets `+s +h` on `desktop.ini` and `+r` on folder, then `ie4uinit -show`.

**5. Preview**
- Audio waveform + player (MP3/FLAC/WAV/M4A), image zoom, video scrubber, doc/code/pdf quick-look.
- Live side pane, double-click to open in default app.

**6. Themes**
- Light / Dark / Midnight / Aurora / Sunset — acrylic, glassmorphism.

---

## Stack — why Rust + Tauri?

| Layer | Choice | Why |
|-------|--------|-----|
| Core | **Rust** | 10-50× faster than Node/Python for walkdir+hashing, zero GC pauses, 12 MB installer |
| Parallel | `rayon` + `walkdir` | Scan 100k files in ~2s, SHA256 in parallel |
| Desktop | **Tauri 2.0** | WebView (Edge WebView2) — not Electron (~15 MB vs 150 MB), native dialogs/fs |
| Frontend | Next.js/React + Tailwind | Reused from Guzo web, glass UI |
| Audio meta | `lofty` | Bitrate/duration/sampleRate without decoding |
| Image | `image` crate | Header-only dims |
| Hash | `sha2` + `blake3` | Fast exact dedup |
| Fuzzy | `strsim` | Similarity grouping |

> **No Electron bloat.** Tauri embeds the system WebView — portable `.exe` ≈ 8-12 MB, RAM ~60 MB vs Electron 200 MB+.

---

## Quick Start (Windows 10/11)

### Option A — Prebuilt installer
1. Download `GuzoOrganizer-1.0.0-setup.exe` from Releases
2. Run (portable, no admin) → pick a folder → choose rule → Arrange
3. Duplicates / Rename / Styles are in the sidebar tabs.

### Option B — Build from source
```powershell
# prerequisites: Rust 1.77+, Node 20+, WebView2 (ships with Windows 11, or install from Microsoft)
git clone https://github.com/mubareksam/guzo
cd guzo/guzo-organizer

# frontend (reuses Next.js static export)
npm install
npm run build   # outputs to src/out

# Rust backend + bundle installer
cargo install tauri-cli
cargo tauri build
# → src-tauri/target/release/bundle/nsis/GuzoOrganizer_1.0.0_x64-setup.exe
# → and portable: src-tauri/target/release/guzo-organizer.exe

# dev mode (hot reload)
cargo tauri dev
```

### Web preview (no install)
The organizer UI also runs in the browser for demo:
```bash
npm install
npm run dev
# open http://localhost:3000/organizer
```
It uses a mock filesystem for demo; the native file picker + hash/arrange work when built as Tauri.

---

## Project Structure

```
guzo-organizer/
├── Cargo.toml              # Rust deps (tauri, rayon, sha2, lofty, image…)
├── tauri.conf.json         # Tauri bundle config (icons, FS scope, NSIS)
├── src-tauri/
│   ├── build.rs
│   └── src/
│       ├── main.rs         # Tauri invoke_handler
│       └── commands/
│           ├── scan.rs     # walkdir+rayon scan, audio/image meta
│           ├── arrange.rs  # preview_arrange + execute_arrange (move/copy + conflict rename)
│           ├── duplicates.rs # hash+audio+size+fuzzy groups, handle_duplicates
│           ├── rename.rs   # preview_rename + execute_rename
│           └── style.rs    # desktop.ini + icon overlay, attrib +s/+h
├── src/                    # Frontend (Next.js static export → Tauri webview)
└── icons/                  # icon.ico / pngs (generate via tauri icon)

src/lib/organizer/          # Shared TS logic (mirrors Rust) for web preview
├── types.ts
├── mockData.ts
└── engine.ts
src/app/organizer/page.tsx  # Polished UI — all 5 tabs
```

---

## Folder Style — How it works on Windows

Explorer honors `desktop.ini` in a folder with System+ReadOnly attributes:

```ini
[.ShellClassInfo]
IconResource=C:\Users\You\AppData\Local\GuzoOrganizer\icons\guzo_glass.ico,0
InfoTip=Guzo Organizer • Glass / Acrylic
```

The app:
1. Generates a tinted `.ico` (color overlay on folder glyph) to `%LOCALAPPDATA%\GuzoOrganizer\icons\`
2. Writes `desktop.ini` + runs `attrib +s +h desktop.ini` and `attrib +r <folder>`
3. Fires `ie4uinit -show` to refresh Explorer.

Glass = translucent icon + `backdrop-blur` in UI; macOS = rounded pill shape with blue tint.

---

## Roadmap

- Watch mode (notify on new files → auto-arrange)
- Content-aware image similarity (pHash)
- Audio duplicate via chromaprint fingerprint (exact vs cover)
- Cloud ignore + OneDrive/Dropbox safe-move
- CLI: `guzo-organizer arrange --by type --src ~/Downloads --dest ~/Sorted --dry-run`

---

MIT — Built by Qmer for Guzo.
