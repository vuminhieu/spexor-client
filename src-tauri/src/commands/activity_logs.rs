//! Activity log commands
use crate::models::{ActivityLog, NewActivityLog};
use crate::schema::activity_logs;
use crate::services::get_pool;
use diesel::prelude::*;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct CreateActivityLogInput {
    pub user_id: Option<i32>,
    pub action: String,
    pub target_type: String,
    pub target_id: Option<i32>,
    pub details: Option<String>,
}

/// Get all activity logs (newest first)
#[tauri::command]
pub fn get_activity_logs() -> Result<Vec<ActivityLog>, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    activity_logs::table
        .order(activity_logs::created_at.desc())
        .limit(100) // Limit to last 100 entries
        .load::<ActivityLog>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Get activity logs by action type
#[tauri::command]
pub fn get_activity_logs_by_action(action: String) -> Result<Vec<ActivityLog>, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    activity_logs::table
        .filter(activity_logs::action.eq(action))
        .order(activity_logs::created_at.desc())
        .limit(50)
        .load::<ActivityLog>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Create a new activity log entry
#[tauri::command]
pub fn create_activity_log(input: CreateActivityLogInput) -> Result<ActivityLog, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    let new_log = NewActivityLog {
        user_id: input.user_id,
        action: input.action,
        target_type: input.target_type,
        target_id: input.target_id,
        details: input.details,
    };

    diesel::insert_into(activity_logs::table)
        .values(&new_log)
        .execute(&mut conn)
        .map_err(|e| format!("Failed to create activity log: {}", e))?;

    activity_logs::table
        .order(activity_logs::id.desc())
        .first::<ActivityLog>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Delete old activity logs (older than specified days)
#[tauri::command]
pub fn cleanup_old_logs(days: i32) -> Result<usize, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    let cutoff_date = chrono::Utc::now().naive_utc() - chrono::Duration::days(days as i64);

    diesel::delete(activity_logs::table.filter(activity_logs::created_at.lt(cutoff_date)))
        .execute(&mut conn)
        .map_err(|e| format!("Failed to cleanup logs: {}", e))
}
