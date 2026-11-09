use crate::AppFile;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

#[derive(Deserialize, Clone)]
pub struct RenameRule {
    pub pattern: String,
    pub find: Option<String>,
    pub replace: Option<String>,
    pub use_regex: Option<bool>,
    pub case_mode: Option<String>,
    pub prefix: Option<String>,
    pub suffix: Option<String>,
    pub numbering: Option<Numbering>,
    pub extension_mode: Option<String>,
    pub custom_ext: Option<String>,
}

#[derive(Deserialize, Serialize, Clone)]
pub struct Numbering {
    pub start: i32,
    pub step: i32,
    pub pad: usize,
    pub enabled: bool,
}

#[derive(Serialize)]
pub struct RenamePreview {
    pub original: String,
    pub new_name: String,
    pub new_path: String,
    pub file: AppFile,
}

fn apply_case(s: &str, mode: &str) -> String {
    match mode {
        "lower" => s.to_lowercase(),
        "upper" => s.to_uppercase(),
        "title" => s.split_whitespace().map(|w| {
            let mut c = w.chars();
            match c.next() {
                None => String::new(),
                Some(f) => f.to_uppercase().collect::<String>() + c.as_str().to_lowercase().as_ref(),
            }
        }).collect::<Vec<_>>().join(" "),
        "camel" => {
            let parts: Vec<&str> = s.split(|c: char| !c.is_alphanumeric()).collect();
            parts.iter().enumerate().map(|(i,p)| if i==0 { p.to_lowercase() } else { let mut c=p.chars(); match c.next(){ None=>String::new(), Some(f)=> f.to_uppercase().collect::<String>()+c.as_str() } }).collect()
        }
        _ => s.to_string(),
    }
}

#[tauri::command]
pub fn preview_rename(
    files: Vec<AppFile>,
    rule: RenameRule,
) -> Result<Vec<RenamePreview>, String> {
    let mut out = Vec::new();
    for (idx, f) in files.iter().enumerate() {
        let dot = f.name.rfind('.');
        let base = dot.map(|i| &f.name[..i]).unwrap_or(&f.name);
        let ext = dot.map(|i| &f.name[i+1..]).unwrap_or("");

        let mut name = rule.pattern.clone();
        // numbering
        if let Some(num) = &rule.numbering {
            if num.enabled {
                let n = num.start + (idx as i32)*num.step;
                let padded = format!("{:0>width$}", n, width=num.pad);
                name = name.replace("{num}", &padded).replace("{n}", &padded);
                // {num:03} syntax
                if let Ok(re) = regex::Regex::new(r"\{num:(\d+)\}") {
                    for cap in re.captures_iter(&rule.pattern.clone()) {
                        let pad: usize = cap[1].parse().unwrap_or(3);
                        let v = format!("{:0>width$}", n, width=pad);
                        name = name.replace(&cap[0], &v);
                    }
                }
            }
        }
        name = name.replace("{name}", base).replace("{ext}", ext).replace("{kind}", &f.kind);

        if let Some(p) = &rule.prefix { name = format!("{}{}", p, name); }
        if let Some(s) = &rule.suffix { name = format!("{}{}", name, s); }

        if let Some(find) = &rule.find {
            if !find.is_empty() {
                if rule.use_regex.unwrap_or(false) {
                    if let Ok(re) = regex::Regex::new(find) {
                        name = re.replace_all(&name, rule.replace.as_deref().unwrap_or("")).to_string();
                    }
                } else {
                    name = name.replace(find, rule.replace.as_deref().unwrap_or(""));
                }
            }
        }

        if let Some(cm) = &rule.case_mode {
            name = apply_case(&name, cm);
        }

        // extension
        let mut final_ext = ext.to_string();
        if let Some(em) = &rule.extension_mode {
            match em.as_str() {
                "lower" => final_ext = ext.to_lowercase(),
                "upper" => final_ext = ext.to_uppercase(),
                "custom" => if let Some(ce) = &rule.custom_ext { final_ext = ce.trim_start_matches('.').to_string(); },
                _ => {}
            }
        }

        let mut new_name = if final_ext.is_empty() { name.clone() } else { format!("{}.{}", name, final_ext) };
        new_name = new_name.replace(['<','>','"',':','/','\\','|','?','*'], "_");
        if new_name.trim().is_empty() { new_name = f.name.clone(); }

        let new_path = format!("{}/{}", f.folder, new_name);

        out.push(RenamePreview {
            original: f.path.clone(),
            new_name,
            new_path,
            file: f.clone(),
        });
    }
    Ok(out)
}

#[tauri::command]
pub fn execute_rename(
    previews: Vec<RenamePreview>,
) -> Result<usize, String> {
    let mut done = 0;
    for p in previews {
        let src = Path::new(&p.original);
        let dst = Path::new(&p.new_path);
        if !src.exists() { continue; }
        if src == dst { continue; }
        // ensure not overwriting existing
        if dst.exists() {
            return Err(format!("Destination exists: {}", p.new_path));
        }
        fs::rename(src, dst).map_err(|e| e.to_string())?;
        done += 1;
    }
    Ok(done)
}
