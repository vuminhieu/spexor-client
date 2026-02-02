# Research: Tech Stack & Architecture

## Target Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Desktop Runtime | Tauri | 2.x | Desktop app wrapper |
| Frontend | React + TypeScript | 19.x | UI framework |
| Build Tool | Vite | 7.x | Fast bundler |
| Styling | TailwindCSS | 4.x | Utility-first CSS |
| State Management | Zustand | 5.x | Lightweight state |
| Backend | Rust | 2021 | Native backend |
| ORM | Diesel | 2.x | SQL ORM for Rust |
| Database | SQLite | 3.x | Local database |

## Architecture Design

### Frontend Structure
```
src/
├── components/
│   ├── features/
│   │   ├── cases/          # Case management
│   │   ├── audio/          # Audio player, waveform
│   │   ├── transcript/     # Transcript editor
│   │   ├── speakers/       # Speaker management
│   │   ├── vocabulary/     # Alert/Replacement words
│   │   ├── users/          # User management
│   │   ├── notifications/  # Notifications
│   │   └── dashboard/      # Dashboard widgets
│   └── ui/                 # Reusable UI components
├── stores/                 # Zustand stores
│   ├── caseStore.ts
│   ├── audioStore.ts
│   ├── speakerStore.ts
│   ├── notificationStore.ts
│   └── userStore.ts
├── hooks/                  # Custom hooks
├── lib/                    # Utilities
├── pages/                  # Page components
└── types/                  # TypeScript types
```

### Backend Structure (Rust)
```
src-tauri/src/
├── commands/
│   ├── cases.rs
│   ├── audio.rs
│   ├── speakers.rs
│   ├── vocabulary.rs
│   ├── users.rs
│   └── notifications.rs
├── models/
│   ├── case.rs
│   ├── audio_file.rs
│   ├── transcript.rs
│   ├── speaker.rs
│   ├── alert_word.rs
│   └── user.rs
├── services/
│   ├── database.rs
│   ├── transcription.rs     # Whisper integration
│   ├── speaker_diarization.rs
│   └── ai_summary.rs
├── schema.rs               # Diesel schema
└── lib.rs
```

## Zustand Store Pattern

```typescript
interface CaseStore {
  cases: Case[];
  currentCase: Case | null;
  loading: boolean;
  
  // Actions
  fetchCases: () => Promise<void>;
  createCase: (data: CreateCaseInput) => Promise<void>;
  updateCase: (id: string, data: UpdateCaseInput) => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
  setCurrentCase: (case: Case) => void;
}

export const useCaseStore = create<CaseStore>((set, get) => ({
  cases: [],
  currentCase: null,
  loading: false,
  
  fetchCases: async () => {
    set({ loading: true });
    const cases = await invoke<Case[]>('get_cases');
    set({ cases, loading: false });
  },
  // ...
}));
```

## Diesel ORM Integration

### Cargo.toml dependencies
```toml
[dependencies]
diesel = { version = "2.2", features = ["sqlite", "r2d2", "chrono"] }
diesel_migrations = "2.2"
libsqlite3-sys = { version = "0.30", features = ["bundled"] }
```

### Database Schema (schema.rs)
```rust
diesel::table! {
    cases (id) {
        id -> Integer,
        code -> Text,
        title -> Text,
        description -> Nullable<Text>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    audio_files (id) {
        id -> Integer,
        case_id -> Integer,
        file_name -> Text,
        file_path -> Text,
        duration -> Float,
        status -> Text,
        created_at -> Timestamp,
    }
}
```

## Key Tauri Plugins Needed

- `tauri-plugin-fs` - File system access
- `tauri-plugin-dialog` - File dialogs
- `tauri-plugin-notification` - Desktop notifications
- `tauri-plugin-store` - Persistent key-value storage
- `tauri-plugin-opener` - Open files/URLs

## Audio Processing Considerations

1. **Transcription**: Integrate Whisper (local or API)
2. **Speaker Diarization**: PyAnnote or similar
3. **Waveform**: wavesurfer.js for React
4. **Audio playback**: HTML5 Audio API
