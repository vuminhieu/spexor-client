# Phase 04: Configuration & Styling

## Context Links
- Parent: [plan.md](plan.md)
- Dependencies: [Phase 02](phase-02-frontend-structure.md)

## Overview

| Property | Value |
|----------|-------|
| Date | 2026-01-30 |
| Description | Cấu hình TailwindCSS v4 và project settings |
| Priority | P2 |
| Effort | 30m |
| Implementation Status | pending |
| Review Status | pending |

## Key Insights

- TailwindCSS v4 sử dụng `@tailwindcss/vite` plugin thay vì PostCSS
- Tauri v2 sử dụng `capabilities/` folder cho permissions
- CSP (Content Security Policy) cần được cấu hình đúng

## Implementation Steps

### Step 1: Install TailwindCSS v4
```powershell
cd c:\Users\ADMIN\hieuvm\spexor_client
npm install -D tailwindcss@latest @tailwindcss/vite@latest
```

### Step 2: Update vite.config.ts

**vite.config.ts**
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
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
```

### Step 3: Create/Update styles.css

**src/styles.css**
```css
@import "tailwindcss";

:root {
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-bg-light: #f9fafb;
  --color-bg-dark: #111827;
  --color-text-light: #111827;
  --color-text-dark: #f9fafb;
}

/* Base styles */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Dark mode support */
.dark {
  color-scheme: dark;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}

/* Utility classes */
.glass {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.8);
}

.dark .glass {
  background: rgba(17, 24, 39, 0.8);
}
```

### Step 4: Update index.html

**index.html**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Spexor Client</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Step 5: Update main.tsx

**src/main.tsx**
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Step 6: Update tauri.conf.json

**src-tauri/tauri.conf.json**
```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "spexor-client",
  "version": "0.1.0",
  "identifier": "com.spexor.client",
  "build": {
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:1420",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "Spexor Client",
        "width": 1200,
        "height": 800,
        "minWidth": 800,
        "minHeight": 600,
        "center": true,
        "resizable": true
      }
    ],
    "security": {
      "csp": "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' http://localhost:1420 ws://localhost:1421"
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}
```

### Step 7: Create tailwind.config.js (optional, for theme extension)

**tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

## Todo List

- [ ] Install TailwindCSS v4
- [ ] Update vite.config.ts
- [ ] Create/update styles.css
- [ ] Update index.html
- [ ] Update main.tsx
- [ ] Update tauri.conf.json
- [ ] Create tailwind.config.js

## Success Criteria

- TailwindCSS classes work in components
- Dark mode toggle functions correctly
- No build errors
- CSP doesn't block resources

## Next Steps

→ [Phase 05: Verify & Test](phase-05-verify-test.md)
