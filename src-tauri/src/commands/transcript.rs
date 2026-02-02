//! Transcript segment commands
use crate::models::{NewTranscriptSegment, TranscriptSegment};
use crate::schema::transcript_segments;
use crate::services::get_pool;
use diesel::prelude::*;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct CreateSegmentInput {
    pub audio_file_id: i32,
    pub speaker_id: Option<i32>,
    pub start_time: f32,
    pub end_time: f32,
    pub text: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateSegmentInput {
    pub speaker_id: Option<i32>,
    pub text: Option<String>,
    pub is_deleted: Option<bool>,
}

/// Get all transcript segments for an audio file
#[tauri::command]
pub fn get_transcript_segments(audio_file_id: i32) -> Result<Vec<TranscriptSegment>, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    transcript_segments::table
        .filter(transcript_segments::audio_file_id.eq(audio_file_id))
        .order(transcript_segments::start_time.asc())
        .load::<TranscriptSegment>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Create a new transcript segment
#[tauri::command]
pub fn create_transcript_segment(input: CreateSegmentInput) -> Result<TranscriptSegment, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    let new_segment = NewTranscriptSegment {
        audio_file_id: input.audio_file_id,
        speaker_id: input.speaker_id,
        start_time: input.start_time,
        end_time: input.end_time,
        text: input.text,
    };

    diesel::insert_into(transcript_segments::table)
        .values(&new_segment)
        .execute(&mut conn)
        .map_err(|e| format!("Failed to create segment: {}", e))?;

    transcript_segments::table
        .order(transcript_segments::id.desc())
        .first::<TranscriptSegment>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Update a transcript segment (speaker, text, or soft delete)
#[tauri::command]
pub fn update_transcript_segment(
    id: i32,
    input: UpdateSegmentInput,
) -> Result<TranscriptSegment, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;
    let target = transcript_segments::table.find(id);

    if let Some(speaker_id) = input.speaker_id {
        diesel::update(target)
            .set(transcript_segments::speaker_id.eq(speaker_id))
            .execute(&mut conn)
            .map_err(|e| e.to_string())?;
    }

    if let Some(text) = input.text {
        diesel::update(target)
            .set(transcript_segments::text.eq(text))
            .execute(&mut conn)
            .map_err(|e| e.to_string())?;
    }

    if let Some(is_deleted) = input.is_deleted {
        diesel::update(target)
            .set(transcript_segments::is_deleted.eq(if is_deleted { 1 } else { 0 }))
            .execute(&mut conn)
            .map_err(|e| e.to_string())?;
    }

    transcript_segments::table
        .find(id)
        .first::<TranscriptSegment>(&mut conn)
        .map_err(|e| format!("Segment not found: {}", e))
}

/// Delete a transcript segment permanently
#[tauri::command]
pub fn delete_transcript_segment(id: i32) -> Result<(), String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    diesel::delete(transcript_segments::table.find(id))
        .execute(&mut conn)
        .map_err(|e| format!("Failed to delete segment: {}", e))?;

    Ok(())
}

/// Bulk create transcript segments (for AI transcription results)
#[tauri::command]
pub fn bulk_create_segments(
    audio_file_id: i32,
    segments: Vec<CreateSegmentInput>,
) -> Result<usize, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    let new_segments: Vec<NewTranscriptSegment> = segments
        .into_iter()
        .map(|s| NewTranscriptSegment {
            audio_file_id,
            speaker_id: s.speaker_id,
            start_time: s.start_time,
            end_time: s.end_time,
            text: s.text,
        })
        .collect();

    let count = diesel::insert_into(transcript_segments::table)
        .values(&new_segments)
        .execute(&mut conn)
        .map_err(|e| format!("Failed to bulk create segments: {}", e))?;

    Ok(count)
}
