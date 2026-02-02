//! Alert word model
use crate::schema::alert_words;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Queryable, Selectable, Serialize)]
#[diesel(table_name = alert_words)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct AlertWord {
    pub id: i32,
    pub keyword: String,
    pub category: String,
    pub description: Option<String>,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Debug, Insertable, Deserialize)]
#[diesel(table_name = alert_words)]
pub struct NewAlertWord {
    pub keyword: String,
    pub category: String,
    pub description: Option<String>,
}

#[derive(Debug, AsChangeset, Deserialize, Default)]
#[diesel(table_name = alert_words)]
pub struct UpdateAlertWord {
    pub keyword: Option<String>,
    pub category: Option<String>,
    pub description: Option<String>,
}
