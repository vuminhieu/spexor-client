# Phase 05: Verify & Test Setup

## Context Links
- Parent: [plan.md](plan.md)
- Dependencies: All previous phases

## Overview

| Property | Value |
|----------|-------|
| Date | 2026-01-30 |
| Description | Xác minh setup hoạt động và test integration |
| Priority | P1 |
| Effort | 30m |
| Implementation Status | pending |
| Review Status | pending |

## Key Insights

Phase này đảm bảo toàn bộ framework hoạt động đúng trước khi bắt đầu phát triển tính năng.

## Implementation Steps

### Step 1: Verify Project Structure
```powershell
cd c:\Users\ADMIN\hieuvm\spexor_client

# Check frontend structure
dir src -Recurse -Directory

# Check backend structure  
dir src-tauri\src -Recurse -Directory
```

**Expected output:**
- src/components/features
- src/components/ui
- src/context
- src/hooks
- src/lib
- src/pages
- src/types
- src-tauri/src/commands
- src-tauri/src/models
- src-tauri/src/services

### Step 2: Run Cargo Check
```powershell
cd c:\Users\ADMIN\hieuvm\spexor_client\src-tauri
cargo check
```

**Expected:** No errors

### Step 3: Run TypeScript Check
```powershell
cd c:\Users\ADMIN\hieuvm\spexor_client
npx tsc --noEmit
```

**Expected:** No type errors

### Step 4: Start Dev Server
```powershell
cd c:\Users\ADMIN\hieuvm\spexor_client
npm run tauri dev
```

**Expected behaviors:**
1. Vite starts on port 1420
2. Rust compiles (first time may take 2-5 minutes)
3. Tauri window opens with your app
4. Hot reload works when editing files

### Step 5: Test Tauri Command Integration

Update home-page.tsx to test command:

**src/pages/home-page.tsx**
```tsx
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "../components/ui/button";
import { useTheme } from "../context/theme-context";

interface GreetResponse {
  message: string;
  timestamp: string;
}

export function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const [greeting, setGreeting] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleGreet = async () => {
    setLoading(true);
    try {
      const response = await invoke<GreetResponse>("greet", { name: "User" });
      setGreeting(response.message);
    } catch (error) {
      setGreeting(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        Spexor Client
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        React + Rust powered by Tauri v2
      </p>
      
      <div className="flex gap-4 justify-center mb-8">
        <Button onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"} Toggle Theme
        </Button>
        <Button onClick={handleGreet} disabled={loading}>
          {loading ? "Loading..." : "Test Tauri Command"}
        </Button>
      </div>
      
      {greeting && (
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
          <p className="text-green-800 dark:text-green-100">{greeting}</p>
        </div>
      )}
    </div>
  );
}
```

### Step 6: Create README.md
```powershell
cd c:\Users\ADMIN\hieuvm\spexor_client
```

**README.md**
```markdown
# Spexor Client

A desktop application built with React + Rust (Tauri v2).

## Prerequisites

- Node.js 18+
- Rust (via rustup)
- Visual C++ Build Tools (Windows)

## Development

```bash
# Install dependencies
npm install

# Start development
npm run tauri dev

# Build for production
npm run tauri build
```

## Project Structure

- `src/` - React frontend
- `src-tauri/` - Rust backend
- `docs/` - Documentation
- `plans/` - Implementation plans

## Tech Stack

- Frontend: React 19, TypeScript, TailwindCSS v4
- Backend: Rust, Tauri v2
- Build: Vite 7
```

## Todo List

- [ ] Verify folder structure
- [ ] Run `cargo check`
- [ ] Run `npx tsc --noEmit`
- [ ] Run `npm run tauri dev`
- [ ] Test theme toggle
- [ ] Test Tauri command
- [ ] Create README.md

## Success Criteria

| Check | Description |
|-------|-------------|
| ✅ | `cargo check` passes |
| ✅ | No TypeScript errors |
| ✅ | `npm run tauri dev` runs |
| ✅ | Window displays UI |
| ✅ | Theme toggle works |
| ✅ | Tauri command returns data |
| ✅ | Hot reload works |

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Port 1420 busy | `netstat -ano | findstr :1420` then kill process |
| Rust compile fails | Check Visual C++ Build Tools installed |
| CSP blocks script | Update security.csp in tauri.conf.json |
| Module not found | Check import paths are correct |

## Next Steps

Framework setup complete! Ready for:
1. Define spexor-client features
2. Implement authentication
3. Add domain-specific commands
4. Design UI components
