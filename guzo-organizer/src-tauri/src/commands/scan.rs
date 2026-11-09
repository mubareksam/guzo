use crate::AppFile;
use chrono::{DateTime, Utc};
use rayon::prelude::*;
use sha2::{Digest, Sha256};
use std::fs;
use std::path::Path;
use walkdir::WalkDir;

/// Scan a folder recursively, collect metadata in parallel (rayon)
#[tauri::command]
pub fn scan_folder(path: String, recursive: bool, max_depth: Option<usize>) -> Result<Vec<AppFile>, String> {
    let p = Path::new(&path);
    if !p.exists() {
        return Err(format!("Path does not exist: {}", path));
    }

    let depth = max_depth.unwrap_or(if recursive { 10 } else { 1 });

    let entries: Vec<_> = WalkDir::new(p)
        .max_depth(depth)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().is_file())
        .collect();

    // Parallel metadata extraction
    let files: Vec<AppFile> = entries
        .par_iter()
        .filter_map(|entry| {
            let path = entry.path();
            let meta = fs::metadata(path).ok()?;
            let name = path.file_name()?.to_string_lossy().to_string();
            let ext = path.extension().and_then(|s| s.to_str()).unwrap_or("").to_lowercase();
            let size = meta.len();
            let modified: DateTime<Utc> = meta.modified().ok()?.into();
            let created: DateTime<Utc> = meta.created().ok().unwrap_or(modified).into();

            // infer kind
            let kind = infer_kind(&ext);

            // audio metadata via lofty (fast)
            let (bitrate, duration, sample_rate) = if kind == "audio" {
                extract_audio_meta(path).unwrap_or((None, None, None))
            } else { (None, None, None) };

            // image dims (only header, not full decode)
            let (width, height) = if kind == "image" {
                image_dims(path).unwrap_or((None, None))
            } else { (None, None) };

            Some(AppFile {
                id: blake3::hash(path.to_string_lossy().as_bytes()).to_hex().to_string()[..8].to_string(),
                name,
                ext,
                kind: kind.to_string(),
                size,
                created: created.to_rfc3339(),
                modified: modified.to_rfc3339(),
                path: path.to_string_lossy().to_string(),
                folder: path.parent().map(|p| p.to_string_lossy().to_string()).unwrap_or_default(),
                hash: None, // computed lazily for duplicates
                bitrate,
                duration,
                sample_rate,
                width,
                height,
            })
        })
        .collect();

    Ok(files)
}

#[tauri::command]
pub fn get_file_preview(path: String) -> Result<serde_json::Value, String> {
    let p = Path::new(&path);
    let meta = fs::metadata(p).map_err(|e| e.to_string())?;
    Ok(serde_json::json!({
        "exists": p.exists(),
        "size": meta.len(),
        "is_file": meta.is_file(),
        "modified": meta.modified().ok().map(|t| DateTime::<Utc>::from(t).to_rfc3339()),
    }))
}

fn infer_kind(ext: &str) -> &'static str {
    match ext {
        "jpg"|"jpeg"|"png"|"webp"|"heic"|"gif"|"svg"|"bmp"|"tiff"|"psd" => "image",
        "mp4"|"mkv"|"mov"|"avi"|"webm"|"m4v"|"3gp" => "video",
        "mp3"|"flac"|"wav"|"m4a"|"ogg"|"aac"|"wma"|"aiff" => "audio",
        "pdf"|"docx"|"doc"|"xlsx"|"pptx"|"txt"|"rtf"|"odt"|"md" => "document",
        "zip"|"rar"|"7z"|"tar"|"gz"|"iso" => "archive",
        "js"|"ts"|"py"|"rs"|"go"|"java"|"cpp"|"json"|"html"|"css"|"toml"|"yaml"|"yml"|"xml" => "code",
        _ => "other",
    }
}

fn extract_audio_meta(path: &Path) -> Result<(Option<u32>, Option<f64>, Option<u32>), String> {
    use lofty::prelude::*;
    let tagged = lofty::probe::Probe::open(path).map_err(|e| e.to_string())?;
    let tagged = tagged.read().map_err(|e| e.to_string())?;
    let props = tagged.properties();
    let bitrate = props.audio_bitrate();
    let duration = props.duration().as_secs_f64();
    let sample_rate = props.sample_rate();
    Ok((bitrate, Some(duration), sample_rate))
}

fn image_dims(path: &Path) -> Result<(Option<u32>, Option<u32>), String> {
    let reader = image::ImageReader::open(path).map_err(|e| e.to_string())?;
    let reader = reader.with_guessed_format().map_err(|e| e.to_string())?;
    if let Ok((w,h)) = reader.into_dimensions().map_err(|e| e.to_string()) {
        Ok((Some(w), Some(h)))
    } else {
        Ok((None, None))
    }
}

// hash helper for duplicates (streamed, not loading whole file)
pub fn hash_file(path: &Path) -> Result<String, String> {
    let mut file = fs::File::open(path).map_err(|e| e.to_string())?;
    let mut hasher = Sha256::new();
    std::io::copy(&mut file, &mut hasher).map_err(|e| e.to_string())?;
    Ok(format!("{:x}", hasher.finalize()))
}
