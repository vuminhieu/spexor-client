---
description: Database Schema & Diesel ORM Setup
status: done
priority: P1
effort: 4h
---

# Phase 01: Database Schema & Diesel Setup

## Context

- Parent Plan: [plan.md](plan.md)
- UI Reference: [folder_app_template/index.html](../../folder_app_template/index.html)
- Features Reference: [researcher-01-features-analysis.md](research/researcher-01-features-analysis.md)

## Overview

Set up Diesel ORM with SQLite database, create migrations for all entities, and establish database connection pool.

## Key Insights

- SQLite bundled with libsqlite3-sys for cross-platform
- Diesel migrations for schema versioning
- R2D2 connection pool for concurrent access
- Chrono for timestamp handling

## Requirements

- [ ] Install Diesel CLI
- [ ] Configure Diesel for SQLite
- [ ] Create database migrations
- [ ] Generate Rust models
- [ ] Set up connection pool
- [ ] Test CRUD operations

## Architecture

### Database Schema

```
┌─────────────┐     ┌──────────────┐     ┌───────────────────┐
│   cases     │─1──*│ audio_files  │─1──*│ transcript_segments│
└─────────────┘     └──────────────┘     └───────────────────┘
                                                   │
┌─────────────┐                                    │
│  speakers   │────────────────────────────────────┘
└─────────────┘

┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│ alert_words │     │ replacement_words│     │    users     │
└─────────────┘     └──────────────────┘     └──────────────┘

┌─────────────────┐     ┌────────────────┐
│  notifications  │     │ activity_logs  │
└─────────────────┘     └────────────────┘
```

## Related Files

```
src-tauri/
├── diesel.toml
├── migrations/
│   ├── 00000000000001_create_cases/
│   ├── 00000000000002_create_audio_files/
│   ├── 00000000000003_create_transcript_segments/
│   ├── 00000000000004_create_speakers/
│   ├── 00000000000005_create_alert_words/
│   ├── 00000000000006_create_replacement_words/
│   ├── 00000000000007_create_users/
│   ├── 00000000000008_create_notifications/
│   └── 00000000000009_create_activity_logs/
└── src/
    ├── schema.rs
    ├── models/
    │   ├── mod.rs
    │   ├── case.rs
    │   ├── audio_file.rs
    │   ├── transcript_segment.rs
    │   ├── speaker.rs
    │   ├── alert_word.rs
    │   ├── replacement_word.rs
    │   ├── user.rs
    │   ├── notification.rs
    │   └── activity_log.rs
    └── services/
        └── database.rs
```

## Implementation Steps

### Step 1: Update Cargo.toml
```toml
[dependencies]
diesel = { version = "2.2", features = ["sqlite", "r2d2", "chrono"] }
diesel_migrations = "2.2"
libsqlite3-sys = { version = "0.30", features = ["bundled"] }
dotenvy = "0.15"
```

### Step 2: Create diesel.toml
```toml
[print_schema]
file = "src/schema.rs"
custom_type_derives = ["diesel::query_builder::QueryId", "Clone"]

[migrations_directory]
dir = "migrations"
```

### Step 3: Create migrations

**Migration 1: cases**
```sql
CREATE TABLE cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Migration 2: audio_files**
```sql
CREATE TABLE audio_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    case_id INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    duration REAL NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);
```

**Migration 3: transcript_segments**
```sql
CREATE TABLE transcript_segments (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    audio_file_id INTEGER NOT NULL,
    speaker_id INTEGER,
    start_time REAL NOT NULL,
    end_time REAL NOT NULL,
    text TEXT NOT NULL,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audio_file_id) REFERENCES audio_files(id) ON DELETE CASCADE,
    FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE SET NULL
);
```

**Migration 4: speakers**
```sql
CREATE TABLE speakers (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL,
    alias TEXT,
    gender TEXT,
    age_estimate TEXT,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE voice_samples (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    speaker_id INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    duration REAL NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE CASCADE
);
```

**Migration 5: alert_words**
```sql
CREATE TABLE alert_words (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    keyword TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL DEFAULT 'Khác',
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Migration 6: replacement_words**
```sql
CREATE TABLE replacement_words (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    original TEXT NOT NULL UNIQUE,
    correct TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Khác',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Migration 7: users**
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'viewer',
    avatar TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Migration 8: notifications**
```sql
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    type TEXT NOT NULL,
    action TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    entity_type TEXT,
    entity_id INTEGER,
    is_read INTEGER NOT NULL DEFAULT 0,
    is_important INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Migration 9: activity_logs**
```sql
CREATE TABLE activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    user_id INTEGER,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id INTEGER,
    details TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### Step 4: Run migrations & generate schema
```bash
cd src-tauri
diesel setup
diesel migration run
```

### Step 5: Create database service
```rust
// src-tauri/src/services/database.rs
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager, Pool};
use std::sync::OnceLock;

pub type DbPool = Pool<ConnectionManager<SqliteConnection>>;

static DB_POOL: OnceLock<DbPool> = OnceLock::new();

pub fn init_db(app_dir: &std::path::Path) -> Result<(), Box<dyn std::error::Error>> {
    let db_path = app_dir.join("spexor.db");
    let manager = ConnectionManager::<SqliteConnection>::new(db_path.to_str().unwrap());
    let pool = r2d2::Pool::builder().max_size(5).build(manager)?;
    
    // Run migrations
    let mut conn = pool.get()?;
    diesel_migrations::run_pending_migrations(&mut conn)?;
    
    DB_POOL.set(pool).expect("Failed to set DB pool");
    Ok(())
}

pub fn get_pool() -> &'static DbPool {
    DB_POOL.get().expect("Database not initialized")
}
```

### Step 6: Create model files

Each model file should contain:
- Queryable struct (for SELECT)
- Insertable struct (for INSERT)
- Serialize/Deserialize traits

## Todo

- [ ] Install diesel_cli: `cargo install diesel_cli --no-default-features --features sqlite`
- [ ] Create diesel.toml
- [ ] Create all 9 migrations
- [ ] Run diesel migration run
- [ ] Create database.rs service
- [ ] Create model files for each entity
- [ ] Test with simple CRUD command

## Success Criteria

1. ✅ Diesel CLI installed and working
2. ✅ All migrations created and run successfully
3. ✅ schema.rs generated with all tables
4. ✅ Connection pool working
5. ✅ Basic CRUD test passing

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| SQLite bundling issues on Windows | Use libsqlite3-sys bundled feature |
| Migration order dependencies | Create tables in correct order |
| R2D2 pool exhaustion | Set reasonable pool size |

## Security Considerations

- Database file stored in app data directory
- No direct SQL injection (Diesel prevents)
- Future: Add encryption with SQLCipher

## Next Steps

After completing this phase:
1. Proceed to [Phase 02: Zustand Stores](phase-02-zustand-stores.md)
