use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

#[derive(Serialize, Deserialize, Clone)]
pub struct FolderStyle {
    pub id: String,
    pub name: String,
    pub color: String,
    pub accent: String,
    pub glass: bool,
    pub icon: String,
    pub emoji: String,
}

pub fn default_styles() -> Vec<FolderStyle> {
    vec![
        FolderStyle { id: "default".into(), name: "Windows Default".into(), color: "#facc15".into(), accent: "#eab308".into(), glass: false, icon: "default".into(), emoji: "📁".into() },
        FolderStyle { id: "mac".into(), name: "macOS".into(), color: "#60a5fa".into(), accent: "#3b82f6".into(), glass: false, icon: "mac".into(), emoji: "📂".into() },
        FolderStyle { id: "glass".into(), name: "Glass / Acrylic".into(), color: "rgba(255,255,255,0.55)".into(), accent: "rgba(255,255,255,0.9)".into(), glass: true, icon: "glass".into(), emoji: "✨".into() },
        FolderStyle { id: "neon".into(), name: "Neon".into(), color: "#a78bfa".into(), accent: "#7c3aed".into(), glass: false, icon: "neon".into(), emoji: "💜".into() },
        FolderStyle { id: "forest".into(), name: "Forest".into(), color: "#34d399".into(), accent: "#059669".into(), glass: false, icon: "minimal".into(), emoji: "🌿".into() },
        FolderStyle { id: "sunset".into(), name: "Sunset".into(), color: "#fb7185".into(), accent: "#e11d48".into(), glass: false, icon: "pill".into(), emoji: "🌅".into() },
        FolderStyle { id: "ocean".into(), name: "Ocean".into(), color: "#38bdf8".into(), accent: "#0284c7".into(), glass: true, icon: "glass".into(), emoji: "🌊".into() },
        FolderStyle { id: "amber".into(), name: "Amber".into(), color: "#fbbf24".into(), accent: "#d97706".into(), glass: false, icon: "archive".into(), emoji: "📦".into() },
    ]
}

#[tauri::command]
pub fn list_styles() -> Result<Vec<FolderStyle>, String> {
    Ok(default_styles())
}

/// Apply folder style via desktop.ini + generated .ico
/// Windows Explorer reads desktop.ini with IconResource
#[tauri::command]
pub fn apply_folder_style(
    folder_path: String,
    style_id: String,
    custom_color: Option<String>,
    icon_path: Option<String>,
) -> Result<String, String> {
    let folder = Path::new(&folder_path);
    if !folder.exists() {
        return Err(format!("Folder does not exist: {}", folder_path));
    }
    if !folder.is_dir() {
        return Err("Not a folder".into());
    }

    let style = default_styles().into_iter().find(|s| s.id == style_id)
        .unwrap_or(FolderStyle { id: style_id.clone(), name: style_id.clone(), color: custom_color.clone().unwrap_or("#facc15".into()), accent: "#eab308".into(), glass: false, icon: "default".into(), emoji: "".into() });

    let color = custom_color.unwrap_or(style.color.clone());
    let ico_path = icon_path.unwrap_or_else(|| {
        // We generate a tinted icon at %LOCALAPPDATA%\GuzoOrganizer\icons\{style_id}.ico
        let base = dirs::data_local_dir().unwrap_or_else(|| std::path::PathBuf::from("."));
        let dir = base.join("GuzoOrganizer").join("icons");
        let _ = fs::create_dir_all(&dir);
        // For now point to embedded icon; real generation would tint PNG → ICO
        dir.join(format!("guzo_{}.ico", style.id)).to_string_lossy().to_string()
    });

    // Write desktop.ini
    let ini = format!(
        "[.ShellClassInfo]\nIconResource={ico},0\nInfoTip=Guzo Organizer • {} • {}\nIconFile={ico}\nIconIndex=0\n",
        style.name, color, ico = ico_path
    );

    let ini_path = folder.join("desktop.ini");
    fs::write(&ini_path, ini).map_err(|e| e.to_string())?;

    // Set hidden+system attributes on Windows (required for Explorer to honor it)
    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        // attrib +s +h desktop.ini and folder
        let _ = std::process::Command::new("attrib")
            .args(["+s", "+h", &ini_path.to_string_lossy().to_string()])
            .creation_flags(0x08000000)
            .output();
        let _ = std::process::Command::new("attrib")
            .args(["+r", &folder_path])
            .creation_flags(0x08000000)
            .output();
    }

    // Trigger Explorer refresh (notify shell)
    #[cfg(target_os = "windows")]
    {
        let _ = std::process::Command::new("ie4uinit.exe")
            .args(["-show"])
            .output();
    }

    Ok(format!("Style '{}' applied to {}", style.name, folder_path))
}
