//! User CRUD commands
use crate::models::{NewUser, User};
use crate::schema::users;
use crate::services::get_pool;
use diesel::prelude::*;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct CreateUserInput {
    pub name: String,
    pub email: String,
    pub role: String,
    pub avatar: Option<String>,
    pub username: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateUserInput {
    pub name: Option<String>,
    pub email: Option<String>,
    pub role: Option<String>,
    pub avatar: Option<String>,
}

/// Get all users
#[tauri::command]
pub fn get_users() -> Result<Vec<User>, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    users::table
        .order(users::name.asc())
        .load::<User>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Get a single user by ID
#[tauri::command]
pub fn get_user(id: i32) -> Result<User, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    users::table
        .find(id)
        .first::<User>(&mut conn)
        .map_err(|e| format!("User not found: {}", e))
}

/// Create a new user
#[tauri::command]
pub fn create_user(input: CreateUserInput) -> Result<User, String> {
    use crate::services::auth_service::hash_password;

    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    let password_hash = hash_password(&input.password).map_err(|e| e.to_string())?;

    let new_user = NewUser {
        name: input.name,
        email: input.email,
        role: input.role,
        avatar: input.avatar,
        username: input.username,
        password_hash,
    };

    diesel::insert_into(users::table)
        .values(&new_user)
        .execute(&mut conn)
        .map_err(|e| format!("Failed to create user: {}", e))?;

    users::table
        .order(users::id.desc())
        .first::<User>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Update a user
#[tauri::command]
pub fn update_user(id: i32, input: UpdateUserInput) -> Result<User, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;
    let target = users::table.find(id);

    if let Some(name) = input.name {
        diesel::update(target)
            .set(users::name.eq(name))
            .execute(&mut conn)
            .map_err(|e| e.to_string())?;
    }

    if let Some(email) = input.email {
        diesel::update(target)
            .set(users::email.eq(email))
            .execute(&mut conn)
            .map_err(|e| e.to_string())?;
    }

    if let Some(role) = input.role {
        diesel::update(target)
            .set(users::role.eq(role))
            .execute(&mut conn)
            .map_err(|e| e.to_string())?;
    }

    if let Some(avatar) = input.avatar {
        diesel::update(target)
            .set(users::avatar.eq(avatar))
            .execute(&mut conn)
            .map_err(|e| e.to_string())?;
    }

    get_user(id)
}

/// Delete a user
#[tauri::command]
pub fn delete_user(id: i32) -> Result<(), String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    diesel::delete(users::table.find(id))
        .execute(&mut conn)
        .map_err(|e| format!("Failed to delete user: {}", e))?;

    Ok(())
}
