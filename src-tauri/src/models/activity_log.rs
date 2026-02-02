//! Activity log model
use crate::schema::activity_logs;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Queryable, Selectable, Serialize)]
#[diesel(table_name = activity_logs)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct ActivityLog {
    pub id: i32,
    pub user_id: Option<i32>,
    pub action: String,
    pub target_type: String,
    pub target_id: Option<i32>,
    pub details: Option<String>,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Debug, Insertable, Deserialize)]
#[diesel(table_name = activity_logs)]
pub struct NewActivityLog {
    pub user_id: Option<i32>,
    pub action: String,
    pub target_type: String,
    pub target_id: Option<i32>,
    pub details: Option<String>,
}
