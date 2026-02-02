//! Transcript segment model
use crate::schema::transcript_segments;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Queryable, Selectable, Serialize)]
#[diesel(table_name = transcript_segments)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct TranscriptSegment {
    pub id: i32,
    pub audio_file_id: i32,
    pub speaker_id: Option<i32>,
    pub start_time: f32,
    pub end_time: f32,
    pub text: String,
    pub is_deleted: i32,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Debug, Insertable, Deserialize)]
#[diesel(table_name = transcript_segments)]
pub struct NewTranscriptSegment {
    pub audio_file_id: i32,
    pub speaker_id: Option<i32>,
    pub start_time: f32,
    pub end_time: f32,
    pub text: String,
}

#[derive(Debug, AsChangeset, Deserialize, Default)]
#[diesel(table_name = transcript_segments)]
pub struct UpdateTranscriptSegment {
    pub speaker_id: Option<i32>,
    pub text: Option<String>,
    pub is_deleted: Option<i32>,
}
