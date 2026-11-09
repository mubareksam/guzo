// Guzo Organizer — Rust + Tauri backend
// Fast, lightweight Windows organizer — arrange, duplicates, batch rename, folder styles
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AppFile {
  pub id: String,
  pub name: String,
  pub ext: String,
  pub kind: String,
  pub size: u64,
  pub created: String,
  pub modified: String,
  pub path: String,
  pub folder: String,
  pub hash: Option<String>,
  pub bitrate: Option<u32>,
  pub duration: Option<f64>,
  pub sample_rate: Option<u32>,
  pub width: Option<u32>,
  pub height: Option<u32>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct ArrangeRule {
  pub mode: String,
  pub date_field: Option<String>,
  pub date_grouping: Option<String>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct PreviewItem {
  pub original_path: String,
  pub new_path: String,
  pub new_folder: String,
  pub file: AppFile,
}

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![
      commands::scan::scan_folder,
      commands::scan::get_file_preview,
      commands::arrange::preview_arrange,
      commands::arrange::execute_arrange,
      commands::duplicates::find_duplicates,
      commands::duplicates::handle_duplicates,
      commands::rename::preview_rename,
      commands::rename::execute_rename,
      commands::style::apply_folder_style,
      commands::style::list_styles,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
