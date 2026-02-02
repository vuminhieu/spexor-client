//! Case model - represents investigation cases
use crate::schema::cases;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

/// Queryable struct for reading cases from database
#[derive(Debug, Clone, Queryable, Selectable, Serialize)]
#[diesel(table_name = cases)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Case {
    pub id: i32,
    pub code: String,
    pub title: String,
    pub description: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
}

/// Insertable struct for creating new cases
#[derive(Debug, Insertable, Deserialize)]
#[diesel(table_name = cases)]
pub struct NewCase {
    pub code: String,
    pub title: String,
    pub description: Option<String>,
}

/// Changeset struct for updating cases
#[derive(Debug, AsChangeset, Deserialize, Default)]
#[diesel(table_name = cases)]
pub struct UpdateCase {
    pub code: Option<String>,
    pub title: Option<String>,
    pub description: Option<String>,
    pub updated_at: Option<chrono::NaiveDateTime>,
}
