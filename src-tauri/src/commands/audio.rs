//! Audio file commands
use crate::models::{AudioFile, NewAudioFile};
use crate::schema::audio_files;
use crate::services::get_pool;
use diesel::prelude::*;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct CreateAudioInput {
    pub case_id: i32,
    pub file_name: String,
    pub file_path: String,
    pub duration: Option<f32>,
    pub status: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateAudioInput {
    pub file_name: Option<String>,
    pub duration: Option<f32>,
    pub status: Option<String>,
}

/// Get all audio files for a case
#[tauri::command]
pub fn get_audio_files(case_id: i32) -> Result<Vec<AudioFile>, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    audio_files::table
        .filter(audio_files::case_id.eq(case_id))
        .order(audio_files::created_at.asc())
        .load::<AudioFile>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Get a single audio file by ID
#[tauri::command]
pub fn get_audio_file(id: i32) -> Result<AudioFile, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    audio_files::table
        .find(id)
        .first::<AudioFile>(&mut conn)
        .map_err(|e| format!("Audio file not found: {}", e))
}

/// Upload/register a new audio file
#[tauri::command]
pub fn upload_audio(input: CreateAudioInput) -> Result<AudioFile, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    let new_audio = NewAudioFile {
        case_id: input.case_id,
        file_name: input.file_name,
        file_path: input.file_path,
        duration: input.duration.unwrap_or(0.0),
        status: input.status.unwrap_or_else(|| "pending".to_string()),
    };

    diesel::insert_into(audio_files::table)
        .values(&new_audio)
        .execute(&mut conn)
        .map_err(|e| format!("Failed to create audio file: {}", e))?;

    audio_files::table
        .order(audio_files::id.desc())
        .first::<AudioFile>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Update audio file metadata
#[tauri::command]
pub fn update_audio_file(id: i32, input: UpdateAudioInput) -> Result<AudioFile, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;
    let target = audio_files::table.find(id);

    if let Some(file_name) = input.file_name {
        diesel::update(target)
            .set(audio_files::file_name.eq(file_name))
            .execute(&mut conn)
            .map_err(|e| e.to_string())?;
    }

    if let Some(duration) = input.duration {
        diesel::update(target)
            .set(audio_files::duration.eq(duration))
            .execute(&mut conn)
            .map_err(|e| e.to_string())?;
    }

    if let Some(status) = input.status {
        diesel::update(target)
            .set(audio_files::status.eq(status))
            .execute(&mut conn)
            .map_err(|e| e.to_string())?;
    }

    get_audio_file(id)
}

/// Delete an audio file
#[tauri::command]
pub fn delete_audio_file(id: i32) -> Result<(), String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    diesel::delete(audio_files::table.find(id))
        .execute(&mut conn)
        .map_err(|e| format!("Failed to delete audio file: {}", e))?;

    Ok(())
}
