use crate::AppFile;
use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::Path;

#[derive(Serialize, Deserialize, Clone)]
pub struct DupCriteria {
    pub hash: Option<bool>,
    pub name: Option<bool>,
    pub size: Option<bool>,
    pub audio_meta: Option<bool>,
    pub fuzzy_name: Option<bool>,
}

#[derive(Serialize, Clone)]
pub struct DuplicateGroup {
    pub id: String,
    pub reason: String,
    pub criteria: Vec<String>,
    pub files: Vec<AppFile>,
    pub wasted_bytes: u64,
}

fn hash_file(path: &str) -> Option<String> {
    use sha2::{Digest, Sha256};
    let mut file = std::fs::File::open(path).ok()?;
    let mut hasher = Sha256::new();
    std::io::copy(&mut file, &mut hasher).ok()?;
    Some(format!("{:x}", hasher.finalize()))
}

#[tauri::command]
pub fn find_duplicates(
    mut files: Vec<AppFile>,
    criteria: DupCriteria,
) -> Result<Vec<DuplicateGroup>, String> {
    let mut groups: Vec<DuplicateGroup> = Vec::new();

    // 1) Exact hash — parallel
    if criteria.hash.unwrap_or(false) {
        // compute missing hashes
        files.par_iter_mut().for_each(|f| {
            if f.hash.is_none() {
                f.hash = hash_file(&f.path);
                // fallback to size if unreadable
                if f.hash.is_none() {
                    f.hash = Some(format!("size-{}", f.size));
                }
            }
        });

        let mut by_hash: HashMap<String, Vec<AppFile>> = HashMap::new();
        for f in &files {
            let h = f.hash.clone().unwrap_or_else(|| f.size.to_string());
            by_hash.entry(h).or_default().push(f.clone());
        }
        for (h, list) in by_hash {
            if list.len() > 1 {
                let wasted = list.iter().skip(1).map(|f| f.size).sum();
                groups.push(DuplicateGroup {
                    id: format!("hash-{h}"),
                    reason: "Identical content (SHA256)".into(),
                    criteria: vec!["hash".into()],
                    files: list,
                    wasted_bytes: wasted,
                });
            }
        }
    }

    // 2) Audio meta: bitrate+duration+sample_rate
    if criteria.audio_meta.unwrap_or(false) {
        let mut by_audio: HashMap<String, Vec<AppFile>> = HashMap::new();
        for f in files.iter().filter(|f| f.kind == "audio") {
            let key = format!("{}|{}|{}", f.bitrate.unwrap_or(0), f.duration.unwrap_or(0.0) as u64, f.sample_rate.unwrap_or(0));
            by_audio.entry(key).or_default().push(f.clone());
        }
        for (k, list) in by_audio if list.len() > 1 {
            if groups.iter().any(|g| list.iter().all(|f| g.files.iter().any(|gf| gf.path == f.path))) { continue; }
            let wasted = list.iter().skip(1).map(|f| f.size).sum();
            groups.push(DuplicateGroup {
                id: format!("audio-{k}"),
                reason: format!("Audio match — {}", k.replace('|', " • ")),
                criteria: vec!["audio_meta".into()],
                files: list,
                wasted_bytes: wasted,
            });
        }
    }

    // 3) Same size
    if criteria.size.unwrap_or(false) {
        let mut by_size: HashMap<u64, Vec<AppFile>> = HashMap::new();
        for f in &files { by_size.entry(f.size).or_default().push(f.clone()); }
        for (sz, list) in by_size if list.len() > 1 {
            if groups.iter().any(|g| list.iter().all(|f| g.files.iter().any(|gf| gf.path == f.path))) { continue; }
            let wasted = list.iter().skip(1).map(|f| f.size).sum();
            groups.push(DuplicateGroup {
                id: format!("size-{sz}"),
                reason: format!("Same size ({} bytes)", sz),
                criteria: vec!["size".into()],
                files: list,
                wasted_bytes: wasted,
            });
        }
    }

    // 4) Same name (case-insensitive)
    if criteria.name.unwrap_or(false) {
        let mut by_name: HashMap<String, Vec<AppFile>> = HashMap::new();
        for f in &files { by_name.entry(f.name.to_lowercase()).or_default().push(f.clone()); }
        for (n, list) in by_name if list.len() > 1 {
            let wasted = list.iter().skip(1).map(|f| f.size).sum();
            groups.push(DuplicateGroup { id: format!("name-{n}"), reason: "Same filename".into(), criteria: vec!["name".into()], files: list, wasted_bytes: wasted });
        }
    }

    // 5) Fuzzy name (normalized stem)
    if criteria.fuzzy_name.unwrap_or(false) {
        let mut by_stem: HashMap<String, Vec<AppFile>> = HashMap::new();
        for f in &files {
            let stem = f.name.to_lowercase().chars().filter(|c| c.is_alphanumeric()).take(8).collect::<String>();
            by_stem.entry(stem).or_default().push(f.clone());
        }
        for (s, list) in by_stem if list.len() > 1 {
            if groups.iter().any(|g| list.iter().all(|f| g.files.iter().any(|gf| gf.path == f.path))) { continue; }
            let wasted = list.iter().skip(1).map(|f| f.size).sum();
            groups.push(DuplicateGroup { id: format!("fuzzy-{s}"), reason: "Similar names (fuzzy)".into(), criteria: vec!["fuzzy_name".into()], files: list, wasted_bytes: wasted });
        }
    }

    Ok(groups)
}

#[tauri::command]
pub fn handle_duplicates(
    paths: Vec<String>,
    action: String, // "delete" | "move"
    dest_folder: Option<String>,
) -> Result<usize, String> {
    let mut done = 0;
    for p in paths {
        let path = Path::new(&p);
        if !path.exists() { continue; }
        match action.as_str() {
            "delete" => {
                std::fs::remove_file(path).map_err(|e| e.to_string())?;
                done += 1;
            }
            "move" => {
                let dest = dest_folder.clone().unwrap_or_else(|| {
                    path.parent().map(|p| p.join("_Duplicates").to_string_lossy().to_string()).unwrap_or("_Duplicates".into())
                });
                std::fs::create_dir_all(&dest).map_err(|e| e.to_string())?;
                let fname = path.file_name().unwrap_or_default();
                let target = Path::new(&dest).join(fname);
                std::fs::rename(path, &target).or_else(|_| {
                    std::fs::copy(path, &target).and_then(|_| std::fs::remove_file(path).map(|_| 0))
                }).map_err(|e| e.to_string())?;
                done += 1;
            }
            _ => return Err("Unknown action".into()),
        }
    }
    Ok(done)
}
