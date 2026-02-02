---
title: "Spexor Client Framework Setup"
description: "Dựng khung React + Rust (Tauri v2) cho dự án spexor-client dựa trên cấu trúc email-sender"
status: pending
priority: P1
effort: 3h
branch: main
tags: [tauri, react, rust, framework, setup]
created: 2026-01-30
---

# Plan: Spexor Client Framework Setup

## Overview

Dự án này thiết lập khung cơ bản cho **spexor-client** - một ứng dụng desktop sử dụng **Tauri v2** với frontend **React + TypeScript** và backend **Rust**.

Cấu trúc được thiết kế dựa trên phân tích dự án tham chiếu `email-sender` đã có.

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | React | 19.x |
| Build Tool | Vite | 7.x |
| Styling | TailwindCSS | 4.x |
| Language | TypeScript | 5.x |
| Backend | Rust | 2021 edition |
| Framework | Tauri | 2.x |
| Async Runtime | Tokio | 1.x |

## Implementation Phases

| Phase | Description | Effort | Status |
|-------|-------------|--------|--------|
| [Phase 01](phase-01-project-init.md) | Initialize Tauri project | 30m | pending |
| [Phase 02](phase-02-frontend-structure.md) | Setup React frontend structure | 45m | pending |
| [Phase 03](phase-03-rust-backend.md) | Setup Rust backend modules | 45m | pending |
| [Phase 04](phase-04-config-styling.md) | Configuration & styling | 30m | pending |
| [Phase 05](phase-05-verify-test.md) | Verify & test setup | 30m | pending |

## Target Project Structure

```
spexor_client/
├── .agent/                 # Agent workflows (existing)
├── GEMINI.md               # AI instructions (existing)
├── docs/                   # Documentation
├── plans/                  # Implementation plans
├── public/                 # Static public assets
├── src/                    # React frontend
│   ├── assets/             # Images, fonts
│   ├── components/
│   │   ├── features/       # Feature components
│   │   └── ui/             # Reusable UI
│   ├── context/            # React contexts
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilities
│   ├── pages/              # Page components
│   ├── types/              # TypeScript types
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── src-tauri/              # Rust backend
│   ├── capabilities/       # Tauri v2 permissions
│   ├── icons/              # App icons
│   ├── src/
│   │   ├── commands/       # Tauri commands
│   │   ├── models/         # Data structures
│   │   ├── services/       # Business logic
│   │   ├── lib.rs
│   │   └── main.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## Research References

- [Tauri Structure Analysis](research/researcher-01-tauri-structure.md)
- [Configuration & Scaffold](research/researcher-02-config-scaffold.md)

## Success Criteria

- [ ] Project initialized with `npm create tauri-app`
- [ ] Frontend structure matches target layout
- [ ] Rust backend has commands/models/services modules
- [ ] TailwindCSS v4 configured correctly
- [ ] `npm run tauri dev` runs successfully
- [ ] Sample Tauri command works from frontend

## Next Steps

After framework setup is complete:
1. Define specific features for spexor-client
2. Implement authentication/security
3. Add domain-specific commands and services
