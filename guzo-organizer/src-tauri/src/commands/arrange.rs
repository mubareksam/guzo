use crate::{AppFile, ArrangeRule, PreviewItem};
use chrono::{DateTime, Utc};
use std::fs;
use std::path::Path;

fn format_date_group(iso: &str, grouping: &str) -> String {
    let dt: DateTime<Utc> = iso.parse().unwrap_or_else(|_| Utc::now());
    match grouping {
        "year" => dt.format("%Y").to_string(),
        "year-month" => dt.format("%Y-%m").to_string(),
        "year-month-day" => dt.format("%Y-%m-%d").to_string(),
        "relative" => {
            let diff = (Utc::now() - dt).num_days();
            if diff == 0 { "Today".into() } else if diff == 1 { "Yesterday".into() } else if diff < 7 { "This Week".into() } else if diff < 30 { "This Month".into() } else { "Older".into() }
        }
        _ => dt.format("%Y-%m").to_string(),
    }
}

fn size_label(size: u64) -> String {
    const MB: u64 = 1024*1024;
    const GB: u64 = 1024*1024*1024;
    match size {
        0..=1048575 => "Tiny (<1 MB)".into(),
        1048576..=10485759 => "Small (1-10 MB)".into(),
        10485760..=104857599 => "Medium (10-100 MB)".into(),
        104857600..=1073741823 => "Large (100 MB-1 GB)".into(),
        _ => "Huge (>1 GB)".into(),
    }
}

fn stem_group(name: &str) -> String {
    let lower = name.to_lowercase();
    let cleaned = lower.replace(|c: char| !c.is_alphanumeric(), " ");
    let cleaned = cleaned.replace("copy", "").replace("final", "").trim().to_string();
    let first = cleaned.split_whitespace().next().unwrap_or(&name[0..4.min(name.len())]);
    let mut s = first.to_string();
    if let Some(c) = s.chars().next() {
        s = c.to_uppercase().collect::<String>() + &s[c.len_utf8()..];
    }
    if s.is_empty() { "Misc".into() } else { s }
}

#[tauri::command]
pub fn preview_arrange(
    files: Vec<AppFile>,
    base_path: String,
    rule: ArrangeRule,
) -> Result<Vec<PreviewItem>, String> {
    let previews = files.into_iter().map(|f| {
        let subfolder = match rule.mode.as_str() {
            "date" => {
                let iso = if rule.date_field.as_deref() == Some("created") { &f.created } else { &f.modified };
                format_date_group(iso, rule.date_grouping.as_deref().unwrap_or("year-month"))
            }
            "type" => {
                let k = f.kind.clone();
                if k == "other" { format!("_{}", f.ext.to_uppercase()) } else { format!("{}{}s", (&k[..1].to_uppercase()), &k[1..]) }
            }
            "extension" => if f.ext.is_empty() { "NO_EXT".into() } else { f.ext.to_uppercase() },
            "size" => size_label(f.size),
            "similarity" => stem_group(&f.name),
            "name" => f.name.chars().next().map(|c| c.to_uppercase().to_string()).unwrap_or("#".into()),
            _ => "Others".into(),
        };

        let clean = subfolder.replace(['<','>','"',':','/','\\','|','?','*'], "_");
        let new_folder = format!("{}/{}", base_path.trim_end_matches('/'), clean);
        let new_path = format!("{}/{}", new_folder, f.name);

        PreviewItem {
            original_path: f.path.clone(),
            new_path,
            new_folder,
            file: f,
        }
    }).collect();
    Ok(previews)
}

#[tauri::command]
pub fn execute_arrange(
    previews: Vec<PreviewItem>,
    mode: String, // "move" | "copy" | "symlink"
    overwrite: bool,
) -> Result<usize, String> {
    let mut done = 0;
    for p in previews {
        let src = Path::new(&p.original_path);
        let dest = Path::new(&p.new_path);
        let folder = Path::new(&p.new_folder);

        if !src.exists() { continue; }
        fs::create_dir_all(folder).map_err(|e| e.to_string())?;

        // conflict handling
        let mut final_dest = dest.to_path_buf();
        if final_dest.exists() && !overwrite {
            let stem = dest.file_stem().and_then(|s| s.to_str()).unwrap_or("file");
            let ext = dest.extension().and_then(|s| s.to_str()).unwrap_or("");
            let mut i = 1;
            loop {
                let candidate = if ext.is_empty() {
                    folder.join(format!("{stem} ({i})"))
                } else {
                    folder.join(format!("{stem} ({i}).{ext}"))
                };
                if !candidate.exists() { final_dest = candidate; break; }
                i += 1;
            }
        }

        match mode.as_str() {
            "copy" => { fs::copy(src, &final_dest).map_err(|e| e.to_string())?; }
            "move" => { fs::rename(src, &final_dest).or_else(|_| {
                fs::copy(src, &final_dest).and_then(|_| fs::remove_file(src).map(|_| 0))
            }).map_err(|e| e.to_string())?; }
            _ => { fs::rename(src, &final_dest).map_err(|e| e.to_string())?; }
        }
        done += 1;
    }
    Ok(done)
}
