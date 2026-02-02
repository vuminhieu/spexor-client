---
description: Rust Backend Commands (CRUD operations)
status: pending
priority: P1
effort: 6h
---

# Phase 03: Rust Backend Commands

## Context

- Parent Plan: [plan.md](plan.md)
- Depends on: [Phase 01](phase-01-database-setup.md) for database
- Depends on: [Phase 02](phase-02-zustand-stores.md) for type sync

## Overview

Implement all Tauri commands for CRUD operations on entities. Commands will interact with SQLite via Diesel ORM.

## Key Insights

- Each entity needs: get_all, get_by_id, create, update, delete
- Use Result<T, String> for error handling
- Serialize responses with serde
- Commands grouped by domain

## Architecture

```
src-tauri/src/commands/
├── mod.rs           # Re-exports all commands
├── cases.rs         # Case CRUD
├── audio.rs         # Audio file CRUD
├── transcript.rs    # Transcript segments
├── speakers.rs      # Speaker CRUD
├── vocabulary.rs    # Alert & replacement words
├── users.rs         # User CRUD
├── notifications.rs # Notification CRUD
└── activity_logs.rs # Activity log queries
```

## Related Files

```
src-tauri/src/
├── commands/        # Command implementations
├── models/          # Diesel models
├── schema.rs        # Diesel schema
├── services/
│   └── database.rs  # DB connection
└── lib.rs           # Register commands
```

## Implementation Steps

### Step 1: Create commands/mod.rs
```rust
pub mod cases;
pub mod audio;
pub mod transcript;
pub mod speakers;
pub mod vocabulary;
pub mod users;
pub mod notifications;
pub mod activity_logs;

// Re-export all commands for lib.rs
pub use cases::*;
pub use audio::*;
pub use transcript::*;
pub use speakers::*;
pub use vocabulary::*;
pub use users::*;
pub use notifications::*;
pub use activity_logs::*;
```

### Step 2: Create Case commands
```rust
// src-tauri/src/commands/cases.rs
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use crate::models::Case;
use crate::schema::cases;
use crate::services::database::get_pool;

#[derive(Deserialize)]
pub struct CreateCaseInput {
    pub code: String,
    pub title: String,
    pub description: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdateCaseInput {
    pub code: Option<String>,
    pub title: Option<String>,
    pub description: Option<String>,
}

#[tauri::command]
pub fn get_cases() -> Result<Vec<Case>, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;
    
    cases::table
        .order(cases::created_at.desc())
        .load::<Case>(&mut conn)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_case(id: i32) -> Result<Case, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;
    
    cases::table
        .find(id)
        .first::<Case>(&mut conn)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_case(input: CreateCaseInput) -> Result<Case, String> {
    use crate::models::NewCase;
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;
    
    let new_case = NewCase {
        code: input.code,
        title: input.title,
        description: input.description,
    };
    
    diesel::insert_into(cases::table)
        .values(&new_case)
        .execute(&mut conn)
        .map_err(|e| e.to_string())?;
    
    cases::table
        .order(cases::id.desc())
        .first::<Case>(&mut conn)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_case(id: i32, input: UpdateCaseInput) -> Result<Case, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;
    
    diesel::update(cases::table.find(id))
        .set((
            input.code.map(|c| cases::code.eq(c)),
            input.title.map(|t| cases::title.eq(t)),
            input.description.map(|d| cases::description.eq(d)),
            cases::updated_at.eq(chrono::Utc::now().naive_utc()),
        ))
        .execute(&mut conn)
        .map_err(|e| e.to_string())?;
    
    get_case(id)
}

#[tauri::command]
pub fn delete_case(id: i32) -> Result<(), String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;
    
    diesel::delete(cases::table.find(id))
        .execute(&mut conn)
        .map_err(|e| e.to_string())?;
    
    Ok(())
}
```

### Step 3: Create Audio commands
```rust
// src-tauri/src/commands/audio.rs
use diesel::prelude::*;
use crate::models::AudioFile;
use crate::schema::audio_files;
use crate::services::database::get_pool;

#[tauri::command]
pub fn get_audio_files(case_id: i32) -> Result<Vec<AudioFile>, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;
    
    audio_files::table
        .filter(audio_files::case_id.eq(case_id))
        .order(audio_files::created_at.asc())
        .load::<AudioFile>(&mut conn)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn upload_audio(
    case_id: i32, 
    file_path: String,
    file_name: String,
) -> Result<AudioFile, String> {
    use crate::models::NewAudioFile;
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;
    
    // Copy file to app data directory
    // TODO: Implement file copy logic
    
    let new_audio = NewAudioFile {
        case_id,
        file_name,
        file_path,
        duration: 0.0,
        status: "pending".to_string(),
    };
    
    diesel::insert_into(audio_files::table)
        .values(&new_audio)
        .execute(&mut conn)
        .map_err(|e| e.to_string())?;
    
    audio_files::table
        .order(audio_files::id.desc())
        .first::<AudioFile>(&mut conn)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_audio_file(id: i32) -> Result<(), String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;
    
    diesel::delete(audio_files::table.find(id))
        .execute(&mut conn)
        .map_err(|e| e.to_string())?;
    
    Ok(())
}
```

### Step 4: Create Speaker commands
```rust
// src-tauri/src/commands/speakers.rs
use diesel::prelude::*;
use serde::Deserialize;
use crate::models::Speaker;
use crate::schema::speakers;
use crate::services::database::get_pool;

#[derive(Deserialize)]
pub struct CreateSpeakerInput {
    pub name: String,
    pub alias: Option<String>,
    pub gender: Option<String>,
    pub age_estimate: Option<String>,
    pub notes: Option<String>,
}

#[tauri::command]
pub fn get_speakers() -> Result<Vec<Speaker>, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;
    
    speakers::table
        .order(speakers::name.asc())
        .load::<Speaker>(&mut conn)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_speaker(input: CreateSpeakerInput) -> Result<Speaker, String> {
    use crate::models::NewSpeaker;
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;
    
    let new_speaker = NewSpeaker {
        name: input.name,
        alias: input.alias,
        gender: input.gender,
        age_estimate: input.age_estimate,
        notes: input.notes,
    };
    
    diesel::insert_into(speakers::table)
        .values(&new_speaker)
        .execute(&mut conn)
        .map_err(|e| e.to_string())?;
    
    speakers::table
        .order(speakers::id.desc())
        .first::<Speaker>(&mut conn)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_speaker(id: i32) -> Result<(), String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;
    
    diesel::delete(speakers::table.find(id))
        .execute(&mut conn)
        .map_err(|e| e.to_string())?;
    
    Ok(())
}
```

### Step 5: Create Vocabulary commands
```rust
// src-tauri/src/commands/vocabulary.rs
use diesel::prelude::*;
use serde::Deserialize;
use crate::models::{AlertWord, ReplacementWord};
use crate::schema::{alert_words, replacement_words};
use crate::services::database::get_pool;

#[derive(Deserialize)]
pub struct CreateAlertWordInput {
    pub keyword: String,
    pub category: String,
    pub description: Option<String>,
}

#[tauri::command]
pub fn get_alert_words() -> Result<Vec<AlertWord>, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;
    
    alert_words::table
        .order(alert_words::keyword.asc())
        .load::<AlertWord>(&mut conn)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_alert_word(input: CreateAlertWordInput) -> Result<AlertWord, String> {
    use crate::models::NewAlertWord;
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;
    
    let new_word = NewAlertWord {
        keyword: input.keyword,
        category: input.category,
        description: input.description,
    };
    
    diesel::insert_into(alert_words::table)
        .values(&new_word)
        .execute(&mut conn)
        .map_err(|e| e.to_string())?;
    
    alert_words::table
        .order(alert_words::id.desc())
        .first::<AlertWord>(&mut conn)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_alert_word(id: i32) -> Result<(), String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;
    
    diesel::delete(alert_words::table.find(id))
        .execute(&mut conn)
        .map_err(|e| e.to_string())?;
    
    Ok(())
}

// Similar for replacement_words...
#[tauri::command]
pub fn get_replacement_words() -> Result<Vec<ReplacementWord>, String> {
    let mut conn = get_pool().get().map_err(|e| e.to_string())?;
    
    replacement_words::table
        .order(replacement_words::original.asc())
        .load::<ReplacementWord>(&mut conn)
        .map_err(|e| e.to_string())
}
```

### Step 6: Register commands in lib.rs
```rust
// src-tauri/src/lib.rs
mod commands;
mod models;
mod schema;
mod services;

use services::database;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let app_dir = app.path().app_data_dir().expect("Failed to get app dir");
            std::fs::create_dir_all(&app_dir).expect("Failed to create app dir");
            database::init_db(&app_dir).expect("Failed to init database");
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            // Cases
            commands::get_cases,
            commands::get_case,
            commands::create_case,
            commands::update_case,
            commands::delete_case,
            // Audio
            commands::get_audio_files,
            commands::upload_audio,
            commands::delete_audio_file,
            // Speakers
            commands::get_speakers,
            commands::create_speaker,
            commands::delete_speaker,
            // Vocabulary
            commands::get_alert_words,
            commands::create_alert_word,
            commands::delete_alert_word,
            commands::get_replacement_words,
            // ... more commands
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Todo

- [ ] Create commands/mod.rs
- [ ] Create cases.rs with CRUD
- [ ] Create audio.rs with file handling
- [ ] Create transcript.rs for segments
- [ ] Create speakers.rs with CRUD
- [ ] Create vocabulary.rs (alert + replacement)
- [ ] Create users.rs with CRUD
- [ ] Create notifications.rs
- [ ] Create activity_logs.rs
- [ ] Register all in lib.rs
- [ ] Test each command

## Success Criteria

1. ✅ All CRUD commands working for each entity
2. ✅ Error handling returns meaningful messages
3. ✅ Commands registered in lib.rs
4. ✅ Frontend can invoke all commands

## Next Steps

After completing this phase:
1. Proceed to [Phase 04: Sidebar & Layout](phase-04-sidebar-layout.md)
