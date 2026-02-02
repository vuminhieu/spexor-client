//! Voice sample model
use crate::schema::voice_samples;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Queryable, Selectable, Serialize)]
#[diesel(table_name = voice_samples)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct VoiceSample {
    pub id: i32,
    pub speaker_id: i32,
    pub file_name: String,
    pub file_path: String,
    pub duration: f32,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Debug, Insertable, Deserialize)]
#[diesel(table_name = voice_samples)]
pub struct NewVoiceSample {
    pub speaker_id: i32,
    pub file_name: String,
    pub file_path: String,
    pub duration: f32,
}
