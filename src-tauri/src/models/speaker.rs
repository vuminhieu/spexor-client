//! Speaker model
use crate::schema::speakers;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Queryable, Selectable, Serialize)]
#[diesel(table_name = speakers)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Speaker {
    pub id: i32,
    pub name: String,
    pub alias: Option<String>,
    pub gender: Option<String>,
    pub age_estimate: Option<String>,
    pub notes: Option<String>,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Debug, Insertable, Deserialize)]
#[diesel(table_name = speakers)]
pub struct NewSpeaker {
    pub name: String,
    pub alias: Option<String>,
    pub gender: Option<String>,
    pub age_estimate: Option<String>,
    pub notes: Option<String>,
}

#[derive(Debug, AsChangeset, Deserialize, Default)]
#[diesel(table_name = speakers)]
pub struct UpdateSpeaker {
    pub name: Option<String>,
    pub alias: Option<String>,
    pub gender: Option<String>,
    pub age_estimate: Option<String>,
    pub notes: Option<String>,
}
