---
description: UI Polish, Remaining Pages, and Final Testing
status: pending
priority: P2
effort: 2h
---

# Phase 12: Polish UI & Final Testing

## Context

- Parent Plan: [plan.md](plan.md)
- Depends on: All previous phases

## Overview

Final polish - complete remaining pages (Users, Support), refine styles, ensure responsive design, and test all features.

## Related Files

```
src/
├── pages/
│   ├── users.tsx
│   └── support.tsx
├── styles.css
└── components/ui/
    └── *.tsx
```

## Implementation Steps

### Step 1: Create Users Page
```tsx
// src/pages/users.tsx
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useUIStore } from '../stores';
import type { User } from '../types';

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  investigator: 'Điều tra viên',
  viewer: 'Người xem',
};

const roleColors: Record<string, string> = {
  admin: 'admin',
  investigator: 'investigator',
  viewer: 'viewer',
};

export function UsersPage() {
  const { openModal, showToast } = useUIStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await invoke<User[]>('get_users');
      setUsers(data);
    } catch (error) {
      console.error(error);
      // Use mock data for now
      setUsers([
        { id: 1, name: 'Nguyễn Văn Admin', email: 'admin@spexor.local', role: 'admin', avatar: null, createdAt: '' },
        { id: 2, name: 'Trần Văn Điều Tra', email: 'tran.dieutra@spexor.local', role: 'investigator', avatar: null, createdAt: '' },
        { id: 3, name: 'Lê Thị Xem', email: 'le.xem@spexor.local', role: 'viewer', avatar: null, createdAt: '' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="page-users" className="page active">
      <div className="page-header">
        <h1>Quản lý người dùng</h1>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => openModal('user-modal')}
          >
            + Thêm người dùng
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="users-grid">
          {users.map(user => (
            <div key={user.id} className="user-card">
              <div className={`user-avatar ${roleColors[user.role]}`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <h4>{user.name}</h4>
                <span className={`role ${roleColors[user.role]}`}>
                  {roleLabels[user.role]}
                </span>
                <p>{user.email}</p>
              </div>
              <div className="user-actions">
                <button className="btn-icon" title="Sửa">✏️</button>
                <button className="btn-icon" title="Đổi mật khẩu">🔑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Step 2: Create Support Page
```tsx
// src/pages/support.tsx
export function SupportPage() {
  const shortcuts = [
    { keys: 'Space', desc: 'Play/Pause audio' },
    { keys: 'Ctrl + S', desc: 'Lưu transcript' },
    { keys: 'Ctrl + F', desc: 'Tìm kiếm' },
    { keys: '←/→', desc: 'Tua 5 giây' },
    { keys: 'Shift + ←/→', desc: 'Tua 30 giây' },
  ];

  const guides = [
    'Bắt đầu nhanh',
    'Quản lý sự vụ',
    'Xử lý audio và transcript',
    'Xuất báo cáo',
  ];

  return (
    <div id="page-support" className="page active">
      <div className="page-header">
        <h1>Hỗ trợ</h1>
      </div>
      
      <div className="support-content">
        <div className="support-section">
          <h3>📖 Hướng dẫn sử dụng</h3>
          <div className="guide-list">
            {guides.map((guide, i) => (
              <a key={i} href="#" className="guide-item">{guide}</a>
            ))}
          </div>
        </div>

        <div className="support-section">
          <h3>⌨️ Phím tắt</h3>
          <div className="shortcuts-list">
            {shortcuts.map((shortcut, i) => (
              <div key={i} className="shortcut-item">
                <span className="shortcut-keys">{shortcut.keys}</span>
                <span className="shortcut-desc">{shortcut.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="support-section">
          <h3>ℹ️ Thông tin hệ thống</h3>
          <div className="system-info">
            <p><strong>Phiên bản:</strong> SPEXOR v1.0.0</p>
            <p><strong>AI Model:</strong> Whisper Large-v3</p>
            <p><strong>Database:</strong> SQLite (Encrypted)</p>
            <p><strong>Framework:</strong> Tauri 2.x + React 19</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 3: Add Polished CSS Styles
```css
/* Add to styles.css - Polish & Refinements */

/* Enhanced Color Scheme */
:root {
  /* Dark theme (default) */
  --bg-primary: #0f0f1a;
  --bg-sidebar: #16162a;
  --bg-card: #1e1e38;
  --bg-hover: rgba(255, 255, 255, 0.05);
  --bg-active: rgba(59, 130, 246, 0.1);
  
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-tertiary: #64748b;
  
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  
  --border-color: rgba(255, 255, 255, 0.1);
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}

/* Smooth transitions */
* {
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}

/* Enhanced Cards */
.card, .stat-card-new, .user-card, .speaker-card {
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

/* Glassmorphism effect for modals */
.modal {
  background: rgba(30, 30, 56, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-overlay {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

/* Highlight animations */
.highlight-alert {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.1));
  padding: 0.125rem 0.25rem;
  border-radius: 4px;
  border: 1px solid rgba(239, 68, 68, 0.5);
  animation: pulse-alert 2s infinite;
}

@keyframes pulse-alert {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Enhanced buttons */
.btn {
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), #6366f1);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

/* Table styling */
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

tbody tr:hover {
  background: var(--bg-hover);
}

/* User grid */
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  color: white;
}

.user-avatar.admin { background: linear-gradient(135deg, #ef4444, #f97316); }
.user-avatar.investigator { background: linear-gradient(135deg, #3b82f6, #6366f1); }
.user-avatar.viewer { background: linear-gradient(135deg, #10b981, #14b8a6); }

.role {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
}

.role.admin { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
.role.investigator { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.role.viewer { background: rgba(16, 185, 129, 0.2); color: #10b981; }

/* Support page */
.support-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.support-section {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 1.5rem;
}

.support-section h3 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.shortcut-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.shortcut-keys {
  background: var(--bg-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.875rem;
  border: 1px solid var(--border-color);
}

/* Empty states */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

/* Loading states */
.loading {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

/* Responsive design */
@media (max-width: 1200px) {
  .workspace-container {
    grid-template-columns: 200px 1fr 250px;
  }
}

@media (max-width: 900px) {
  .workspace-container {
    grid-template-columns: 1fr;
  }
  
  .audio-files-panel,
  .workspace-right {
    display: none; /* Hide panels on small screens */
  }
}
```

### Step 4: Testing Checklist

| Area | Test | Expected |
|------|------|----------|
| Navigation | Click each nav item | Pages switch correctly |
| Dashboard | View stats | All 5 cards display |
| Cases | Create case | Modal opens, saves |
| Cases | Delete case | Confirms, removes |
| Workspace | Open case | Loads audio files |
| Audio | Play button | Toggles play state |
| Transcript | Delete segment | Shows restore bar |
| Speakers | Add speaker | Modal saves |
| Alert Words | Filter by category | Table filters |
| Notifications | Mark as read | Updates visual |
| Theme | Toggle dark/light | Persists to localStorage |

## Todo

- [ ] Create users.tsx page
- [ ] Create support.tsx page
- [ ] Add polished CSS styles
- [ ] Test all navigation
- [ ] Test all CRUD operations
- [ ] Test responsive design
- [ ] Test dark/light theme
- [ ] Fix any visual bugs
- [ ] Optimize performance

## Success Criteria

1. ✅ All 9 pages render correctly
2. ✅ Dark theme looks polished
3. ✅ Smooth transitions and animations
4. ✅ All CRUD operations work
5. ✅ No console errors
6. ✅ Responsive on different sizes

## Final Checklist

- [ ] Run `cargo check` - no errors
- [ ] Run `npx tsc --noEmit` - no errors
- [ ] Run `npm run tauri dev` - app launches
- [ ] Test each page manually
- [ ] Verify database persistence
- [ ] Check memory usage

## Completion

After this phase, the SPEXOR application will have:
- Complete sidebar navigation with all 9 pages
- Dashboard with stats and charts
- Case management with CRUD
- Audio workspace with player and transcript
- Speaker management with voice samples
- Alert and replacement word management
- Notifications and activity logs
- Support page with shortcuts

The application is ready for further AI integration (Whisper, speaker diarization) and production deployment.
