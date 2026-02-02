//! Alert words and replacement words commands
use crate::models::{AlertWord, NewAlertWord, NewReplacementWord, ReplacementWord};
use crate::schema::{alert_words, replacement_words};
use crate::services::get_pool;
use diesel::prelude::*;
use serde::Deserialize;

// ============================================
// Alert Word types
// ============================================

#[derive(Debug, Deserialize)]
pub struct CreateAlertWordInput {
    pub keyword: String,
    pub category: String,
    pub description: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateReplacementWordInput {
    pub original: String,
    pub correct: String,
    pub category: String,
}

// ============================================
// Alert Word commands
// ============================================

/// Get all alert words
#[tauri::command]
pub fn get_alert_words() -> Result<Vec<AlertWord>, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    alert_words::table
        .order(alert_words::keyword.asc())
        .load::<AlertWord>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Get alert words by category
#[tauri::command]
pub fn get_alert_words_by_category(category: String) -> Result<Vec<AlertWord>, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    alert_words::table
        .filter(alert_words::category.eq(category))
        .order(alert_words::keyword.asc())
        .load::<AlertWord>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Create a new alert word
#[tauri::command]
pub fn create_alert_word(input: CreateAlertWordInput) -> Result<AlertWord, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    let new_word = NewAlertWord {
        keyword: input.keyword,
        category: input.category,
        description: input.description,
    };

    diesel::insert_into(alert_words::table)
        .values(&new_word)
        .execute(&mut conn)
        .map_err(|e| format!("Failed to create alert word: {}", e))?;

    alert_words::table
        .order(alert_words::id.desc())
        .first::<AlertWord>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Delete an alert word
#[tauri::command]
pub fn delete_alert_word(id: i32) -> Result<(), String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    diesel::delete(alert_words::table.find(id))
        .execute(&mut conn)
        .map_err(|e| format!("Failed to delete alert word: {}", e))?;

    Ok(())
}

// ============================================
// Replacement Word commands
// ============================================

/// Get all replacement words
#[tauri::command]
pub fn get_replacement_words() -> Result<Vec<ReplacementWord>, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    replacement_words::table
        .order(replacement_words::original.asc())
        .load::<ReplacementWord>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Create a new replacement word
#[tauri::command]
pub fn create_replacement_word(
    input: CreateReplacementWordInput,
) -> Result<ReplacementWord, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    let new_word = NewReplacementWord {
        original: input.original,
        correct: input.correct,
        category: input.category,
    };

    diesel::insert_into(replacement_words::table)
        .values(&new_word)
        .execute(&mut conn)
        .map_err(|e| format!("Failed to create replacement word: {}", e))?;

    replacement_words::table
        .order(replacement_words::id.desc())
        .first::<ReplacementWord>(&mut conn)
        .map_err(|e| e.to_string())
}

/// Delete a replacement word
#[tauri::command]
pub fn delete_replacement_word(id: i32) -> Result<(), String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;

    diesel::delete(replacement_words::table.find(id))
        .execute(&mut conn)
        .map_err(|e| format!("Failed to delete replacement word: {}", e))?;

    Ok(())
}
