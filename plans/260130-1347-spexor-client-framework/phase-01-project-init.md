# Phase 01: Project Initialization

## Context Links
- Parent: [plan.md](plan.md)
- Dependencies: Node.js, Rust, Tauri CLI

## Overview

| Property | Value |
|----------|-------|
| Date | 2026-01-30 |
| Description | Initialize Tauri v2 project với React + TypeScript |
| Priority | P1 |
| Effort | 30m |
| Implementation Status | pending |
| Review Status | pending |

## Key Insights

- Tauri v2 sử dụng `npm create tauri-app@latest` để khởi tạo
- Cần cài đặt Rust + C++ build tools trước
- Project sẽ được tạo trong thư mục hiện tại với `./`

## Requirements

1. Node.js v18+ installed
2. Rust và Cargo installed
3. C++ Build Tools (Windows)
4. Tauri CLI

## Implementation Steps

### Step 1: Verify Prerequisites
```powershell
# Check Node.js
node --version

# Check Rust
rustc --version
cargo --version

# Check npm
npm --version
```

### Step 2: Create Tauri App
```powershell
cd c:\Users\ADMIN\hieuvm\spexor_client

# Create Tauri app with React + TypeScript template
npm create tauri-app@latest ./ -- --template react-ts --yes
```

**Expected prompts/options:**
- Template: React + TypeScript
- Project directory: ./
- Package manager: npm

### Step 3: Install Dependencies
```powershell
npm install
```

### Step 4: Verify Installation
```powershell
# Check Tauri CLI available
npm run tauri --help

# Check project structure
dir src-tauri
```

## Todo List

- [ ] Verify Node.js v18+ installed
- [ ] Verify Rust installed
- [ ] Run `npm create tauri-app@latest`
- [ ] Run `npm install`
- [ ] Verify `src-tauri` folder created

## Success Criteria

- `package.json` exists với Tauri dependencies
- `src-tauri/` folder exists với Cargo.toml
- `npm run tauri dev` starts without errors

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Rust not installed | High | Install via rustup |
| Build tools missing | High | Install Visual Studio Build Tools |
| Port 1420 busy | Low | Kill process hoặc change port |

## Security Considerations

- Không commit secrets vào repo
- Sử dụng `.gitignore` cho `node_modules`, `target/`

## Next Steps

→ [Phase 02: Frontend Structure](phase-02-frontend-structure.md)
