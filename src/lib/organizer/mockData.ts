import { MockFile, extOf, inferKind } from "./types";

function rDate(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(Math.floor(Math.random()*24), Math.floor(Math.random()*60));
  return d.toISOString();
}

const NAMES = [
  "vacation_photo_001.jpg", "vacation_photo_002.jpg", "IMG_2024_11_05.heic", "screenshot_2024.png", "beach-sunset-final2.jpg",
  "project_proposal_v3.pdf", "invoice-2024-11.pdf", "notes.txt", "resume_final.docx", "budget_2024.xlsx",
  "song - dream lights.mp3", "song - dream lights (1).mp3", "podcast_episode_42.m4a", "mixdown_final.wav", "lofi_beats.flac",
  "birthday_clip.mp4", "screen-record.mov", "trailer_1080p.mkv", "tutorial_final.mp4", "drone_4k_60fps.mp4",
  "archive_backup.zip", "old-files.tar.gz", "installer_v2.iso", "app-release-v1.2.3.zip",
  "main.ts", "utils.py", "Cargo.toml", "README.md", "photo_edits.psd",
  "IMG_1234 (copy).jpg", "vacation_photo_001 (1).jpg", "song - dream lights - copy.mp3",
];

function mkFile(name: string, daysAgo: number, sizeMB: number): MockFile {
  const ext = extOf(name);
  const kind = inferKind(ext);
  const size = Math.round(sizeMB * 1024 * 1024 * (0.7 + Math.random()*0.6));
  const created = rDate(daysAgo + Math.floor(Math.random()*2));
  const modified = rDate(daysAgo);
  const folder = "/Users/Alex/Downloads";
  const audioExtras = kind==="audio" ? {
    bitrate: [128,192,256,320][Math.floor(Math.random()*4)],
    duration: 60 + Math.floor(Math.random()*240),
    sampleRate: [44100,48000][Math.floor(Math.random()*2)],
  } : {};
  const imageExtras = kind==="image" ? { width: 4000, height: 3000 } : {};
  return {
    id: Math.random().toString(36).slice(2,9),
    name, ext, kind, size, created, modified,
    path: `${folder}/${name}`,
    folder,
    hash: Math.floor(size/1024).toString(16).padStart(8,"0") + "-" + name.slice(0,3),
    ...audioExtras,
    ...imageExtras,
  };
}

export const MOCK_FILES: MockFile[] = NAMES.map((n,i)=>{
  const days = [0,0,1,2,5,7,8,14,15,30,32,60,90,120][i%14];
  const sizes = [4.2, 4.2, 8.1, 2.3, 6.5, 1.2, 0.9, 0.02, 0.8, 0.4, 7.8, 7.8, 45, 120, 22, 340, 210, 890, 125, 2400, 560, 1200, 4200, 88, 0.01, 0.02, 0.01, 0.005, 45];
  return mkFile(n, days, sizes[i] ?? 5);
});

// inject intentional duplicates: same hash groups
(() => {
  // group 1: photo duplicate
  MOCK_FILES[0].hash = "dupA";
  MOCK_FILES[1].hash = "dupA"; // similar but different shot? but same hash for demo -> duplicate copy
  MOCK_FILES[30].hash = "dupA"; // copy
  MOCK_FILES[31].hash = "dupA";
  // group 2: audio same content diff name
  MOCK_FILES[10].hash = "dupB";
  MOCK_FILES[11].hash = "dupB";
  MOCK_FILES[32].hash = "dupB";
  MOCK_FILES[10].bitrate = 320; MOCK_FILES[11].bitrate = 320; MOCK_FILES[32].bitrate = 320;
  MOCK_FILES[10].duration = 212; MOCK_FILES[11].duration = 212; MOCK_FILES[32].duration = 212;
})();
