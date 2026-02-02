//! Case CRUD commands
use crate::models::{Case, NewCase};
use crate::schema::cases;
use crate::services::get_pool;
use diesel::prelude::*;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct CreateCaseInput {
    pub code: String,
    pub title: String,
    pub description: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateCaseInput {
    pub code: Option<String>,
    pub title: Option<String>,
    pub description: Option<String>,
}

/// Get all cases ordered by creation date (newest first)
#[tauri::command]
pub fn get_cases() -> Result<Vec<Case>, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    cases::table
        .order(cases::created_at.desc())
        .load::<Case>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Get a single case by ID
#[tauri::command]
pub fn get_case(id: i32) -> Result<Case, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    cases::table
        .find(id)
        .first::<Case>(&mut conn)
        .map_err(|e| format!("Case not found: {}", e))
}

/// Create a new case
#[tauri::command]
pub fn create_case(input: CreateCaseInput) -> Result<Case, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    let new_case = NewCase {
        code: input.code,
        title: input.title,
        description: input.description,
    };

    diesel::insert_into(cases::table)
        .values(&new_case)
        .execute(&mut conn)
        .map_err(|e| format!("Failed to create case: {}", e))?;

    // Return the newly created case
    cases::table
        .order(cases::id.desc())
        .first::<Case>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Update an existing case
#[tauri::command]
pub fn update_case(id: i32, input: UpdateCaseInput) -> Result<Case, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    // Build update query dynamically
    let target = cases::table.find(id);

    if let Some(code) = input.code {
        diesel::update(target)
            .set(cases::code.eq(code))
            .execute(&mut conn)
            .map_err(|e| e.to_string())?;
    }

    if let Some(title) = input.title {
        diesel::update(target)
            .set(cases::title.eq(title))
            .execute(&mut conn)
            .map_err(|e| e.to_string())?;
    }

    if let Some(description) = input.description {
        diesel::update(target)
            .set(cases::description.eq(description))
            .execute(&mut conn)
            .map_err(|e| e.to_string())?;
    }

    // Update timestamp
    diesel::update(target)
        .set(cases::updated_at.eq(chrono::Utc::now().naive_utc()))
        .execute(&mut conn)
        .map_err(|e| e.to_string())?;

    get_case(id)
}

/// Delete a case by ID (cascades to audio_files, transcript_segments)
#[tauri::command]
pub fn delete_case(id: i32) -> Result<(), String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    diesel::delete(cases::table.find(id))
        .execute(&mut conn)
        .map_err(|e| format!("Failed to delete case: {}", e))?;

    Ok(())
}
