---
description: Sidebar Navigation & Application Layout
status: pending
priority: P1
effort: 2h
---

# Phase 04: Sidebar Navigation & Layout

## Context

- Parent Plan: [plan.md](plan.md)
- UI Reference: [folder_app_template/index.html](../../folder_app_template/index.html) lines 14-77

## Overview

Implement sidebar navigation and main application layout matching the SPEXOR template design.

## Related Files

```
src/
├── components/
│   └── ui/
│       ├── layout.tsx        # Main layout wrapper
│       ├── sidebar.tsx       # Sidebar navigation
│       ├── nav-item.tsx      # Navigation item
│       └── user-profile.tsx  # User profile dropdown
├── pages/
│   └── *.tsx                 # All page components
└── App.tsx                   # Root with router
```

## Implementation Steps

### Step 1: Create Sidebar Component
```tsx
// src/components/ui/sidebar.tsx
import { useUIStore } from '../../stores';
import { NavItem } from './nav-item';
import { UserProfile } from './user-profile';

const navItems = [
  { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
  { id: 'cases', icon: '📁', label: 'Quản lý sự vụ' },
  { id: 'users', icon: '👥', label: 'Quản lý người dùng' },
  { id: 'speakers', icon: '🎤', label: 'Quản lý người nói' },
  { 
    id: 'vocabulary', 
    icon: '📚', 
    label: 'Quản lý từ vựng',
    submenu: [
      { id: 'alert-words', icon: '⚠️', label: 'Từ ngữ cảnh báo' },
      { id: 'replacements', icon: '🔄', label: 'Từ ngữ thay thế' },
    ]
  },
  { id: 'logs', icon: '📝', label: 'Nhật ký hoạt động' },
];

const footerItems = [
  { id: 'notifications', icon: '🔔', label: 'Thông báo', badge: 3 },
  { id: 'support', icon: '❓', label: 'Hỗ trợ' },
];

export function Sidebar() {
  const { currentPage, setPage, sidebarExpanded } = useUIStore();
  
  return (
    <aside className={`sidebar ${sidebarExpanded ? '' : 'collapsed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">S</div>
          {sidebarExpanded && <span className="logo-text">SPEXOR</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavItem 
            key={item.id}
            {...item}
            active={currentPage === item.id}
            onClick={() => setPage(item.id)}
            expanded={sidebarExpanded}
          />
        ))}
      </nav>

      <div className="sidebar-footer">
        {footerItems.map((item) => (
          <NavItem 
            key={item.id}
            {...item}
            active={currentPage === item.id}
            onClick={() => setPage(item.id)}
            expanded={sidebarExpanded}
          />
        ))}
        <UserProfile expanded={sidebarExpanded} />
      </div>
    </aside>
  );
}
```

### Step 2: Create NavItem Component
```tsx
// src/components/ui/nav-item.tsx
import { useState } from 'react';

interface NavItemProps {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
  badge?: number;
  submenu?: { id: string; icon: string; label: string }[];
  expanded?: boolean;
  onClick?: () => void;
}

export function NavItem({ 
  id, icon, label, active, badge, submenu, expanded, onClick 
}: NavItemProps) {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  
  const handleClick = () => {
    if (submenu) {
      setSubmenuOpen(!submenuOpen);
    } else {
      onClick?.();
    }
  };
  
  return (
    <>
      <a
        href="#"
        className={`nav-item ${active ? 'active' : ''} ${submenu ? 'has-submenu' : ''}`}
        onClick={(e) => { e.preventDefault(); handleClick(); }}
      >
        <span className="nav-icon">{icon}</span>
        {expanded && (
          <>
            <span className="nav-text">{label}</span>
            {badge && <span className="badge">{badge}</span>}
            {submenu && <span className="nav-arrow">{submenuOpen ? '▲' : '▼'}</span>}
          </>
        )}
      </a>
      
      {submenu && submenuOpen && expanded && (
        <div className="submenu">
          {submenu.map((sub) => (
            <a
              key={sub.id}
              href="#"
              className="nav-item sub"
              onClick={(e) => { e.preventDefault(); onClick?.(); }}
            >
              <span className="nav-icon">{sub.icon}</span>
              <span className="nav-text">{sub.label}</span>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
```

### Step 3: Create Layout Component
```tsx
// src/components/ui/layout.tsx
import { Sidebar } from './sidebar';
import { Toast } from './toast';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
      <Toast />
    </div>
  );
}
```

### Step 4: Create Toast Component
```tsx
// src/components/ui/toast.tsx
import { useUIStore } from '../../stores';

export function Toast() {
  const { toast, hideToast } = useUIStore();
  
  if (!toast) return null;
  
  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  };
  
  return (
    <div className={`toast toast-${toast.type}`}>
      <span className="toast-icon">{icons[toast.type]}</span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={hideToast}>×</button>
    </div>
  );
}
```

### Step 5: Update App.tsx with Router
```tsx
// src/App.tsx
import { useEffect } from 'react';
import { Layout } from './components/ui/layout';
import { useUIStore, useSettingsStore } from './stores';

// Pages
import { Dashboard } from './pages/dashboard';
import { CasesPage } from './pages/cases';
import { WorkspacePage } from './pages/workspace';
import { UsersPage } from './pages/users';
import { SpeakersPage } from './pages/speakers';
import { AlertWordsPage } from './pages/alert-words';
import { ReplacementsPage } from './pages/replacements';
import { LogsPage } from './pages/logs';
import { NotificationsPage } from './pages/notifications';
import { SupportPage } from './pages/support';

const pages: Record<string, React.FC> = {
  dashboard: Dashboard,
  cases: CasesPage,
  workspace: WorkspacePage,
  users: UsersPage,
  speakers: SpeakersPage,
  'alert-words': AlertWordsPage,
  replacements: ReplacementsPage,
  logs: LogsPage,
  notifications: NotificationsPage,
  support: SupportPage,
};

export default function App() {
  const { currentPage } = useUIStore();
  const { theme } = useSettingsStore();
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  const PageComponent = pages[currentPage] || Dashboard;
  
  return (
    <Layout>
      <PageComponent />
    </Layout>
  );
}
```

### Step 6: Add CSS styles
```css
/* Add to src/styles.css */

/* App Container */
.app-container {
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: var(--bg-sidebar);
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-color);
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  color: white;
}

.logo-text {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--text-primary);
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.nav-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--bg-active);
  color: var(--primary);
  border-left: 3px solid var(--primary);
}

.nav-icon {
  font-size: 1.25rem;
}

.nav-text {
  flex: 1;
}

.badge {
  background: var(--danger);
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Submenu */
.submenu {
  padding-left: 1rem;
}

.nav-item.sub {
  padding-left: 2rem;
}

/* Sidebar Footer */
.sidebar-footer {
  border-top: 1px solid var(--border-color);
  padding: 0.5rem 0;
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--bg-card);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
```

## Todo

- [ ] Create sidebar.tsx
- [ ] Create nav-item.tsx
- [ ] Update layout.tsx
- [ ] Create toast.tsx
- [ ] Update App.tsx with page routing
- [ ] Create placeholder page components
- [ ] Add sidebar CSS styles
- [ ] Test navigation works

## Success Criteria

1. ✅ Sidebar renders with all nav items
2. ✅ Navigation switches pages correctly
3. ✅ Active state highlights current page
4. ✅ Submenu expand/collapse works
5. ✅ Toast notifications display

## Next Steps

After completing this phase:
1. Proceed to [Phase 05: Dashboard](phase-05-dashboard.md)
