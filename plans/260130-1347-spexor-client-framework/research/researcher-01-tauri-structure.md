# Research: Tauri v2 + React + Rust Project Structure

## Reference Project Analysis: email-sender

### Frontend Stack (React/TypeScript)
```
src/
├── assets/             # Static assets (images, fonts)
├── components/
│   ├── features/       # Feature-specific components
│   └── ui/             # Reusable UI components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
├── types/              # TypeScript type definitions
├── App.tsx             # Root component
├── main.tsx            # Entry point
└── styles.css          # Global styles
```

### Backend Stack (Rust/Tauri)
```
src-tauri/
├── capabilities/       # Tauri v2 permissions/capabilities
├── icons/              # App icons
├── src/
│   ├── commands/       # Tauri command handlers
│   │   ├── mod.rs
│   │   ├── email.rs
│   │   └── smtp.rs
│   ├── models/         # Data structures
│   │   └── mod.rs
│   ├── services/       # Business logic services
│   │   ├── mod.rs
│   │   ├── smtp_service.rs
│   │   └── template_service.rs
│   ├── lib.rs          # Library entry point
│   └── main.rs         # Main entry point
├── Cargo.toml          # Rust dependencies
├── tauri.conf.json     # Tauri configuration
└── build.rs            # Build script
```

### Key Dependencies Found

**Frontend (package.json):**
- React 19.x
- Vite 7.x
- TailwindCSS 4.x
- Tauri API v2
- Tauri plugins: dialog, fs, notification, opener, store

**Backend (Cargo.toml):**
- Tauri v2
- tauri-plugin-* (dialog, notification, opener, store, fs)
- serde + serde_json (serialization)
- tokio (async runtime)
- thiserror (error handling)

## Tauri v2 Key Features

1. **Capabilities System**: Replaced old CSP config with granular permissions
2. **Plugin Architecture**: Modular features via plugins
3. **Mobile Support**: Android and iOS support
4. **Improved Security**: Built-in security features
5. **Async Commands**: Full async/await support in Rust

## Architecture Patterns

### Command Pattern
```rust
#[tauri::command]
pub async fn command_name(app: AppHandle, args...) -> Result<T, String> {
    // Implementation
}
```

### Module Organization
- `commands/`: Expose Tauri commands to frontend
- `services/`: Business logic, reusable across commands
- `models/`: Data structures shared between modules

### Frontend-Backend Communication
```typescript
import { invoke } from "@tauri-apps/api/core";
const result = await invoke("command_name", { arg1, arg2 });
```

## Citations
- Tauri v2 Official Docs: https://v2.tauri.app/
- Reference Project: C:\Users\ADMIN\PycharmProjects\tool_sent_mail\email-sender
