# Phase 03: Rust Backend Setup

## Context Links
- Parent: [plan.md](plan.md)
- Dependencies: [Phase 01](phase-01-project-init.md)

## Overview

| Property | Value |
|----------|-------|
| Date | 2026-01-30 |
| Description | Thiết lập Rust backend với module structure |
| Priority | P1 |
| Effort | 45m |
| Implementation Status | pending |
| Review Status | pending |

## Key Insights

Backend Rust được tổ chức theo mô hình:
- **commands/**: Các Tauri commands expose cho frontend
- **models/**: Data structures dùng chung
- **services/**: Business logic, có thể tái sử dụng

## Target Structure

```
src-tauri/
├── src/
│   ├── commands/
│   │   ├── mod.rs
│   │   └── greet.rs
│   ├── models/
│   │   └── mod.rs
│   ├── services/
│   │   └── mod.rs
│   ├── lib.rs
│   └── main.rs
├── Cargo.toml
├── tauri.conf.json
└── build.rs
```

## Implementation Steps

### Step 1: Create Module Directories
```powershell
cd c:\Users\ADMIN\hieuvm\spexor_client\src-tauri\src

mkdir commands
mkdir models
mkdir services
```

### Step 2: Create Commands Module

**src-tauri/src/commands/mod.rs**
```rust
pub mod greet;
```

**src-tauri/src/commands/greet.rs**
```rust
use crate::models::GreetResponse;

#[tauri::command]
pub fn greet(name: String) -> GreetResponse {
    GreetResponse {
        message: format!("Hello, {}! Welcome to Spexor.", name),
        timestamp: chrono::Utc::now().to_rfc3339(),
    }
}

#[tauri::command]
pub async fn greet_async(name: String) -> Result<GreetResponse, String> {
    // Simulate async operation
    tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
    
    Ok(GreetResponse {
        message: format!("Async hello, {}!", name),
        timestamp: chrono::Utc::now().to_rfc3339(),
    })
}
```

### Step 3: Create Models Module

**src-tauri/src/models/mod.rs**
```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GreetResponse {
    pub message: String,
    pub timestamp: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AppConfig {
    pub theme: String,
    pub language: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiError {
    pub code: String,
    pub message: String,
}
```

### Step 4: Create Services Module

**src-tauri/src/services/mod.rs**
```rust
// Placeholder for business logic services
// Example: config_service, api_service, etc.

pub fn init() {
    println!("Services initialized");
}
```

### Step 5: Update lib.rs

**src-tauri/src/lib.rs**
```rust
mod commands;
mod models;
mod services;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    services::init();
    
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::greet::greet,
            commands::greet::greet_async,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### Step 6: Update Cargo.toml

Thêm dependencies cần thiết:

```toml
[dependencies]
tauri = { version = "2", features = [] }
tauri-plugin-opener = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
thiserror = "1"
tokio = { version = "1", features = ["full"] }
chrono = { version = "0.4", features = ["serde"] }
```

### Step 7: Verify Rust Code Compiles
```powershell
cd c:\Users\ADMIN\hieuvm\spexor_client\src-tauri
cargo check
```

## Related Code Files

| File | Purpose |
|------|---------|
| lib.rs | Main entry, registers commands |
| commands/greet.rs | Sample command handlers |
| models/mod.rs | Shared data structures |
| services/mod.rs | Business logic placeholder |

## Todo List

- [ ] Create commands directory
- [ ] Create models directory
- [ ] Create services directory
- [ ] Write commands/mod.rs
- [ ] Write commands/greet.rs
- [ ] Write models/mod.rs
- [ ] Write services/mod.rs
- [ ] Update lib.rs
- [ ] Update Cargo.toml
- [ ] Run `cargo check`

## Success Criteria

- `cargo check` passes without errors
- Commands registered in lib.rs
- Module imports work correctly

## Next Steps

→ [Phase 04: Configuration & Styling](phase-04-config-styling.md)
