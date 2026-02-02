# Phase 02: Frontend Structure Setup

## Context Links
- Parent: [plan.md](plan.md)
- Dependencies: [Phase 01](phase-01-project-init.md)

## Overview

| Property | Value |
|----------|-------|
| Date | 2026-01-30 |
| Description | Thiết lập cấu trúc thư mục React frontend |
| Priority | P1 |
| Effort | 45m |
| Implementation Status | pending |
| Review Status | pending |

## Key Insights

Cấu trúc frontend được thiết kế theo pattern của email-sender:
- **components/features/**: Components theo feature (business logic)
- **components/ui/**: Reusable UI components
- **context/**: React Context providers
- **hooks/**: Custom React hooks
- **lib/**: Utility functions
- **pages/**: Page-level components
- **types/**: TypeScript type definitions

## Target Structure

```
src/
├── assets/
│   └── .gitkeep
├── components/
│   ├── features/
│   │   └── .gitkeep
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── layout.tsx
├── context/
│   └── theme-context.tsx
├── hooks/
│   └── use-tauri.ts
├── lib/
│   └── utils.ts
├── pages/
│   └── home-page.tsx
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── styles.css
```

## Implementation Steps

### Step 1: Create Directory Structure
```powershell
cd c:\Users\ADMIN\hieuvm\spexor_client

mkdir -p src/assets
mkdir -p src/components/features
mkdir -p src/components/ui
mkdir -p src/context
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/pages
mkdir -p src/types
```

### Step 2: Create Base UI Components

**src/components/ui/button.tsx**
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({ variant = "primary", size = "md", children, ...props }: ButtonProps) {
  const baseClasses = "rounded font-medium transition-colors focus:outline-none focus:ring-2";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    ghost: "bg-transparent hover:bg-gray-100",
  };
  const sizeClasses = { sm: "px-2 py-1 text-sm", md: "px-4 py-2", lg: "px-6 py-3 text-lg" };
  
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`} {...props}>
      {children}
    </button>
  );
}
```

**src/components/ui/layout.tsx**
```tsx
interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
```

### Step 3: Create Theme Context

**src/context/theme-context.tsx**
```tsx
import { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
```

### Step 4: Create Custom Hook for Tauri

**src/hooks/use-tauri.ts**
```typescript
import { invoke } from "@tauri-apps/api/core";

export function useTauriCommand<T>(command: string) {
  const execute = async (args?: Record<string, unknown>): Promise<T> => {
    return await invoke<T>(command, args);
  };
  return { execute };
}
```

### Step 5: Update App.tsx

**src/App.tsx**
```tsx
import { ThemeProvider } from "./context/theme-context";
import { Layout } from "./components/ui/layout";
import { HomePage } from "./pages/home-page";

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <HomePage />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
```

### Step 6: Create Home Page

**src/pages/home-page.tsx**
```tsx
import { Button } from "../components/ui/button";
import { useTheme } from "../context/theme-context";

export function HomePage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        Spexor Client
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        React + Rust powered by Tauri v2
      </p>
      <Button onClick={toggleTheme}>
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </Button>
    </div>
  );
}
```

## Todo List

- [ ] Create all directories
- [ ] Create button.tsx component
- [ ] Create layout.tsx component
- [ ] Create theme-context.tsx
- [ ] Create use-tauri.ts hook
- [ ] Update App.tsx
- [ ] Create home-page.tsx

## Success Criteria

- All directories exist
- Components render without errors
- Theme toggle works
- No TypeScript errors

## Next Steps

→ [Phase 03: Rust Backend](phase-03-rust-backend.md)
