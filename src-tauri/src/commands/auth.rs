//! Authentication commands
use crate::models::user::UserResponse;
use crate::services::auth_service;
use crate::services::database::DbPool;
use tauri::State;

#[tauri::command]
pub fn login(
    pool: State<'_, DbPool>,
    username: String,
    password: String,
) -> Result<UserResponse, String> {
    auth_service::login(&pool, &username, &password).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn logout() -> Result<(), String> {
    Ok(())
}

#[tauri::command]
pub fn get_current_user(
    pool: State<'_, DbPool>,
    user_id: Option<i32>,
) -> Result<Option<UserResponse>, String> {
    match user_id {
        Some(id) => auth_service::get_user_by_id(&pool, id).map_err(|e| e.to_string()),
        None => Ok(None),
    }
}

#[tauri::command]
pub fn change_password(
    pool: State<'_, DbPool>,
    user_id: i32,
    current_password: String,
    new_password: String,
) -> Result<(), String> {
    auth_service::change_password(&pool, user_id, &current_password, &new_password)
        .map_err(|e| e.to_string())
}
