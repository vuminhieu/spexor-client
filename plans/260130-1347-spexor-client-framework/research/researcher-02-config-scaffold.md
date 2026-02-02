# Research: Project Scaffold & Configuration Details

## Configuration Files Analysis

### vite.config.ts
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
  plugins: [react(), tailwindcss()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host ? { protocol: "ws", host, port: 1421 } : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
```

### tsconfig.json
- Target: ES2020
- Module: ESNext
- Bundler mode với moduleResolution
- Strict TypeScript với noUnusedLocals, noUnusedParameters

### tauri.conf.json (Tauri v2 Schema)
```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "app-name",
  "version": "0.1.0",
  "identifier": "com.company.app",
  "build": {
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:1420",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [{ "title": "App", "width": 1200, "height": 800 }],
    "security": { "csp": "..." }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": ["icons/*.png", "icons/*.ico"]
  }
}
```

### Cargo.toml Structure
```toml
[package]
name = "app-name"
version = "0.1.0"
edition = "2021"

[lib]
name = "app_name_lib"
crate-type = ["staticlib", "cdylib", "rlib"]

[build-dependencies]
tauri-build = { version = "2", features = [] }

[dependencies]
tauri = { version = "2", features = [] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
thiserror = "1"
tokio = { version = "1", features = ["full"] }
```

## TailwindCSS v4 Integration

TailwindCSS v4 sử dụng `@tailwindcss/vite` thay vì PostCSS plugin truyền thống:
```javascript
// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

## Scripts
```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "tauri": "tauri"
}
```

## Command to Initialize
```bash
# Tạo Tauri app với React template
npm create tauri-app@latest

# Hoặc thêm Tauri vào project có sẵn
npm install @tauri-apps/cli
npm run tauri init
```

## Citations
- Vite + Tauri: https://v2.tauri.app/start/frontend/vite/
- TailwindCSS v4: https://tailwindcss.com/docs/installation/vite
