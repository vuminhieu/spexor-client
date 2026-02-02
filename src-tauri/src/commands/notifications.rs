//! Notification commands
use crate::models::{NewNotification, Notification};
use crate::schema::notifications;
use crate::services::get_pool;
use diesel::prelude::*;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct CreateNotificationInput {
    pub notification_type: String,
    pub action: String,
    pub title: String,
    pub message: Option<String>,
    pub entity_type: Option<String>,
    pub entity_id: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateNotificationInput {
    pub is_read: Option<bool>,
    pub is_important: Option<bool>,
}

/// Get all notifications (newest first)
#[tauri::command]
pub fn get_notifications() -> Result<Vec<Notification>, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    notifications::table
        .order(notifications::created_at.desc())
        .load::<Notification>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Get unread notifications count
#[tauri::command]
pub fn get_unread_count() -> Result<i64, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    notifications::table
        .filter(notifications::is_read.eq(0))
        .count()
        .get_result::<i64>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Create a new notification
#[tauri::command]
pub fn create_notification(input: CreateNotificationInput) -> Result<Notification, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    let new_notification = NewNotification {
        notification_type: input.notification_type,
        action: input.action,
        title: input.title,
        message: input.message,
        entity_type: input.entity_type,
        entity_id: input.entity_id,
    };

    diesel::insert_into(notifications::table)
        .values(&new_notification)
        .execute(&mut conn)
        .map_err(|e| format!("Failed to create notification: {}", e))?;

    notifications::table
        .order(notifications::id.desc())
        .first::<Notification>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Update notification (mark as read or important)
#[tauri::command]
pub fn update_notification(
    id: i32,
    input: UpdateNotificationInput,
) -> Result<Notification, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;
    let target = notifications::table.find(id);

    if let Some(is_read) = input.is_read {
        diesel::update(target)
            .set(notifications::is_read.eq(if is_read { 1 } else { 0 }))
            .execute(&mut conn)
            .map_err(|e| e.to_string())?;
    }

    if let Some(is_important) = input.is_important {
        diesel::update(target)
            .set(notifications::is_important.eq(if is_important { 1 } else { 0 }))
            .execute(&mut conn)
            .map_err(|e| e.to_string())?;
    }

    notifications::table
        .find(id)
        .first::<Notification>(&mut conn)
        .map_err(|e| format!("Notification not found: {}", e))
}

/// Mark all notifications as read
#[tauri::command]
pub fn mark_all_notifications_read() -> Result<usize, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    diesel::update(notifications::table.filter(notifications::is_read.eq(0)))
        .set(notifications::is_read.eq(1))
        .execute(&mut conn)
        .map_err(|e| format!("Failed to mark all as read: {}", e))
}

/// Delete a notification
#[tauri::command]
pub fn delete_notification(id: i32) -> Result<(), String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    diesel::delete(notifications::table.find(id))
        .execute(&mut conn)
        .map_err(|e| format!("Failed to delete notification: {}", e))?;

    Ok(())
}
