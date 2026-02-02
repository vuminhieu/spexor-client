---
title: "SPEXOR Full Application Implementation"
description: "Build complete SPEXOR audio investigation app with all features"
status: pending
priority: P1
effort: 40h
branch: main
tags: [tauri, react, rust, diesel, zustand, sqlite]
created: 2026-01-30
---

# SPEXOR Full Application Implementation Plan

## Overview

Build complete SPEXOR desktop application - an audio-to-text investigation tool with case management, transcription, speaker recognition, and alert word detection.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Desktop Runtime | Tauri 2.x |
| Frontend | React 19 + TypeScript + Vite 7 |
| Styling | TailwindCSS 4.x |
| State Management | Zustand 5.x |
| Backend | Rust + Diesel ORM 2.x |
| Database | SQLite |

## Implementation Phases

| Phase | Description | Status | Effort |
|-------|-------------|--------|--------|
| [Phase 01](phase-01-database-setup.md) | Database Schema & Diesel Setup | ✅ done | 4h |
| [Phase 02](phase-02-zustand-stores.md) | Zustand Stores & State Management | ✅ done | 3h |
| [Phase 03](phase-03-rust-commands.md) | Rust Backend Commands (CRUD) | ✅ done | 6h |
| [Phase 04](phase-04-sidebar-layout.md) | Sidebar Navigation & Layout | ✅ done | 2h |
| [Phase 05](phase-05-dashboard.md) | Dashboard Page | ✅ done | 3h |
| [Phase 06](phase-06-case-management.md) | Case Management (List + CRUD) | ✅ done | 4h |
| [Phase 07](phase-07-workspace-core.md) | Workspace Core (Audio Player) | ✅ done | 4h |
| [Phase 08](phase-08-transcript-editor.md) | Transcript Editor & Speaker Panel | ✅ done | 4h |
| [Phase 09](phase-09-speaker-management.md) | Speaker Management | ✅ done | 3h |
| [Phase 10](phase-10-vocabulary.md) | Alert Words & Replacement Words | ✅ done | 3h |
| [Phase 11](phase-11-notifications.md) | Notifications & Activity Logs | ✅ done | 2h |
| [Phase 12](phase-12-polish.md) | Polish UI & Final Testing | ✅ done | 2h |

## Research References

- [Features Analysis](research/researcher-01-features-analysis.md) - Core features từ SPEXOR UI docs
- [Tech Stack](research/researcher-02-tech-stack.md) - Architecture & stack details

## Core Features

### Must-Have (P1)
1. Case CRUD + Workspace
2. Audio upload & playback
3. Transcript display & editing
4. Speaker management & assignment
5. Alert word detection & highlighting
6. Export Word/PDF

### Nice-to-Have (P2)
1. AI Transcription (Whisper integration)
2. Speaker diarization
3. AI Summary
4. User authentication
5. Activity logs
6. Dashboard charts

## Target Project Structure

```
spexor_client/
├── src/
│   ├── components/
│   │   ├── features/
│   │   │   ├── cases/
│   │   │   ├── audio/
│   │   │   ├── transcript/
│   │   │   └── ...
│   │   └── ui/
│   ├── stores/              # Zustand stores
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   └── types/
├── src-tauri/
│   ├── migrations/          # Diesel migrations
│   └── src/
│       ├── commands/
│       ├── models/
│       ├── services/
│       └── schema.rs
└── folder_app_template/     # UI reference
```

## Success Criteria

1. ✅ All 9 pages from template implemented
2. ✅ Database CRUD operations working
3. ✅ Audio player with waveform visualization
4. ✅ Transcript editor with speaker assignment
5. ✅ Alert word highlighting
6. ✅ Export functionality
7. ✅ Responsive dark theme UI

## Next Steps

1. Review plan.md
2. Start with Phase 01 (Database Setup)
