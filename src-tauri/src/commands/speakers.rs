//! Speaker CRUD commands
use crate::models::{NewSpeaker, NewVoiceSample, Speaker, VoiceSample};
use crate::schema::{speakers, voice_samples};
use crate::services::get_pool;
use diesel::prelude::*;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct CreateSpeakerInput {
    pub name: String,
    pub alias: Option<String>,
    pub gender: Option<String>,
    pub age_estimate: Option<String>,
    pub notes: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateSpeakerInput {
    pub name: Option<String>,
    pub alias: Option<String>,
    pub gender: Option<String>,
    pub age_estimate: Option<String>,
    pub notes: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateVoiceSampleInput {
    pub speaker_id: i32,
    pub file_name: String,
    pub file_path: String,
    pub duration: f32,
}

/// Get all speakers ordered by name
#[tauri::command]
pub fn get_speakers() -> Result<Vec<Speaker>, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    speakers::table
        .order(speakers::name.asc())
        .load::<Speaker>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Get a single speaker by ID
#[tauri::command]
pub fn get_speaker(id: i32) -> Result<Speaker, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    speakers::table
        .find(id)
        .first::<Speaker>(&mut conn)
        .map_err(|e| format!("Speaker not found: {}", e))
}

/// Create a new speaker
#[tauri::command]
pub fn create_speaker(input: CreateSpeakerInput) -> Result<Speaker, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    let new_speaker = NewSpeaker {
        name: input.name,
        alias: input.alias,
        gender: input.gender,
        age_estimate: input.age_estimate,
        notes: input.notes,
    };

    diesel::insert_into(speakers::table)
        .values(&new_speaker)
        .execute(&mut conn)
        .map_err(|e| format!("Failed to create speaker: {}", e))?;

    speakers::table
        .order(speakers::id.desc())
        .first::<Speaker>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Update a speaker
#[tauri::command]
pub fn update_speaker(id: i32, input: UpdateSpeakerInput) -> Result<Speaker, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;
    let target = speakers::table.find(id);

    if let Some(name) = input.name {
        diesel::update(target)
            .set(speakers::name.eq(name))
            .execute(&mut conn)
            .map_err(|e| e.to_string())?;
    }

    if let Some(alias) = input.alias {
        diesel::update(target)
            .set(speakers::alias.eq(alias))
            .execute(&mut conn)
            .map_err(|e| e.to_string())?;
    }

    if let Some(gender) = input.gender {
        diesel::update(target)
            .set(speakers::gender.eq(gender))
            .execute(&mut conn)
            .map_err(|e| e.to_string())?;
    }

    if let Some(age_estimate) = input.age_estimate {
        diesel::update(target)
            .set(speakers::age_estimate.eq(age_estimate))
            .execute(&mut conn)
            .map_err(|e| e.to_string())?;
    }

    if let Some(notes) = input.notes {
        diesel::update(target)
            .set(speakers::notes.eq(notes))
            .execute(&mut conn)
            .map_err(|e| e.to_string())?;
    }

    get_speaker(id)
}

/// Delete a speaker (voice samples cascade)
#[tauri::command]
pub fn delete_speaker(id: i32) -> Result<(), String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    diesel::delete(speakers::table.find(id))
        .execute(&mut conn)
        .map_err(|e| format!("Failed to delete speaker: {}", e))?;

    Ok(())
}

// ============================================
// Voice Sample commands
// ============================================

/// Get voice samples for a speaker
#[tauri::command]
pub fn get_voice_samples(speaker_id: i32) -> Result<Vec<VoiceSample>, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    voice_samples::table
        .filter(voice_samples::speaker_id.eq(speaker_id))
        .order(voice_samples::created_at.desc())
        .load::<VoiceSample>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Add a voice sample to a speaker
#[tauri::command]
pub fn create_voice_sample(input: CreateVoiceSampleInput) -> Result<VoiceSample, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    let new_sample = NewVoiceSample {
        speaker_id: input.speaker_id,
        file_name: input.file_name,
        file_path: input.file_path,
        duration: input.duration,
    };

    diesel::insert_into(voice_samples::table)
        .values(&new_sample)
        .execute(&mut conn)
        .map_err(|e| format!("Failed to create voice sample: {}", e))?;

    voice_samples::table
        .order(voice_samples::id.desc())
        .first::<VoiceSample>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Delete a voice sample
#[tauri::command]
pub fn delete_voice_sample(id: i32) -> Result<(), String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    diesel::delete(voice_samples::table.find(id))
        .execute(&mut conn)
        .map_err(|e| format!("Failed to delete voice sample: {}", e))?;

    Ok(())
}
