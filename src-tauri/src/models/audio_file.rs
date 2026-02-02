//! Audio file model
use crate::schema::audio_files;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Queryable, Selectable, Serialize)]
#[diesel(table_name = audio_files)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct AudioFile {
    pub id: i32,
    pub case_id: i32,
    pub file_name: String,
    pub file_path: String,
    pub duration: f32,
    pub status: String,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Debug, Insertable, Deserialize)]
#[diesel(table_name = audio_files)]
pub struct NewAudioFile {
    pub case_id: i32,
    pub file_name: String,
    pub file_path: String,
    pub duration: f32,
    pub status: String,
}

#[derive(Debug, AsChangeset, Deserialize, Default)]
#[diesel(table_name = audio_files)]
pub struct UpdateAudioFile {
    pub file_name: Option<String>,
    pub duration: Option<f32>,
    pub status: Option<String>,
}
