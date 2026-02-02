//! Notification model
use crate::schema::notifications;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Queryable, Selectable, Serialize)]
#[diesel(table_name = notifications)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Notification {
    pub id: i32,
    pub notification_type: String,
    pub action: String,
    pub title: String,
    pub message: Option<String>,
    pub entity_type: Option<String>,
    pub entity_id: Option<i32>,
    pub is_read: i32,
    pub is_important: i32,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Debug, Insertable, Deserialize)]
#[diesel(table_name = notifications)]
pub struct NewNotification {
    pub notification_type: String,
    pub action: String,
    pub title: String,
    pub message: Option<String>,
    pub entity_type: Option<String>,
    pub entity_id: Option<i32>,
}

#[derive(Debug, AsChangeset, Deserialize, Default)]
#[diesel(table_name = notifications)]
pub struct UpdateNotification {
    pub is_read: Option<i32>,
    pub is_important: Option<i32>,
}
