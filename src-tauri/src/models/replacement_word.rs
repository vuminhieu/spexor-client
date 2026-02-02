//! Replacement word model
use crate::schema::replacement_words;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Queryable, Selectable, Serialize)]
#[diesel(table_name = replacement_words)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct ReplacementWord {
    pub id: i32,
    pub original: String,
    pub correct: String,
    pub category: String,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Debug, Insertable, Deserialize)]
#[diesel(table_name = replacement_words)]
pub struct NewReplacementWord {
    pub original: String,
    pub correct: String,
    pub category: String,
}

#[derive(Debug, AsChangeset, Deserialize, Default)]
#[diesel(table_name = replacement_words)]
pub struct UpdateReplacementWord {
    pub original: Option<String>,
    pub correct: Option<String>,
    pub category: Option<String>,
}
