---
description: Notifications & Activity Logs Pages
status: pending
priority: P2
effort: 2h
---

# Phase 11: Notifications & Activity Logs

## Context

- Parent Plan: [plan.md](plan.md)
- UI Reference: [folder_app_template/index.html](../../folder_app_template/index.html) lines 1009-1155

## Overview

Notifications page with filters and important events config. Activity logs page with filtering.

## Related Files

```
src/
├── components/
│   └── features/
│       ├── notifications/
│       │   ├── notification-list.tsx
│       │   ├── notification-item.tsx
│       │   └── important-events-panel.tsx
│       └── logs/
│           └── logs-table.tsx
└── pages/
    ├── notifications.tsx
    └── logs.tsx
```

## Implementation Steps

### Step 1: Create Notifications Page
```tsx
// src/pages/notifications.tsx
import { useState } from 'react';
import { useSettingsStore, useUIStore } from '../stores';
import { NotificationList } from '../components/features/notifications/notification-list';
import { ImportantEventsPanel } from '../components/features/notifications/important-events-panel';

export function NotificationsPage() {
  const { showToast } = useUIStore();
  const [filters, setFilters] = useState({
    type: 'all',
    dateFrom: '',
    dateTo: '',
  });
  const [showImportantPanel, setShowImportantPanel] = useState(false);

  const markAllRead = () => {
    showToast('success', 'Đã đánh dấu tất cả đã đọc');
  };

  const resetFilters = () => {
    setFilters({ type: 'all', dateFrom: '', dateTo: '' });
  };

  return (
    <div id="page-notifications" className="page active">
      <div className="page-header">
        <h1>Thông báo</h1>
        <button className="btn btn-secondary" onClick={markAllRead}>
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      {/* Filter Controls */}
      <div className="notification-filters">
        <div className="filter-group">
          <label>Loại sự kiện:</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
          >
            <option value="all">Tất cả</option>
            <option value="alert">⚠️ Cảnh báo</option>
            <option value="success">✅ Thành công</option>
            <option value="crud">📋 CRUD (Tạo/Sửa/Xóa)</option>
            <option value="system">⚙️ Hệ thống</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Từ ngày:</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
          />
        </div>
        <div className="filter-group">
          <label>Đến ngày:</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters(f => ({ ...f, dateTo: e.target.value }))}
          />
        </div>
        <button className="btn btn-secondary btn-sm" onClick={resetFilters}>
          🔄 Đặt lại
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowImportantPanel(true)}
        >
          ⭐ Sự kiện quan trọng
        </button>
      </div>

      <NotificationList filters={filters} />

      {showImportantPanel && (
        <ImportantEventsPanel onClose={() => setShowImportantPanel(false)} />
      )}
    </div>
  );
}
```

### Step 2: Create Notification List
```tsx
// src/components/features/notifications/notification-list.tsx
import { useState } from 'react';
import { NotificationItem } from './notification-item';
import type { Notification } from '../../../types';

interface NotificationListProps {
  filters: {
    type: string;
    dateFrom: string;
    dateTo: string;
  };
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'alert',
    action: 'alert',
    title: 'Phát hiện từ khóa cảnh báo',
    message: 'Từ khóa "chuyển khoản" phát hiện trong file audio_001.wav',
    entityType: 'audio',
    entityId: 1,
    isRead: false,
    isImportant: true,
    createdAt: '2026-01-22T13:45:00Z',
  },
  {
    id: 2,
    type: 'success',
    action: 'complete',
    title: 'Hoàn thành transcription',
    message: 'File audio_001.wav đã xử lý xong',
    entityType: 'audio',
    entityId: 1,
    isRead: false,
    isImportant: false,
    createdAt: '2026-01-22T13:30:00Z',
  },
  {
    id: 3,
    type: 'crud',
    action: 'create',
    title: 'Tạo sự vụ mới',
    message: 'Sự vụ VV-2026-015 đã được tạo',
    entityType: 'case',
    entityId: 15,
    isRead: true,
    isImportant: true,
    createdAt: '2026-01-22T13:00:00Z',
  },
];

export function NotificationList({ filters }: NotificationListProps) {
  const [notifications, setNotifications] = useState(mockNotifications);

  const filteredNotifications = notifications.filter(n => {
    if (filters.type !== 'all' && n.type !== filters.type) return false;
    // Add date filtering if needed
    return true;
  });

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const toggleImportant = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isImportant: !n.isImportant } : n
    ));
  };

  if (filteredNotifications.length === 0) {
    return (
      <div className="empty-state">
        <p>Không có thông báo nào.</p>
      </div>
    );
  }

  return (
    <div className="notifications-list">
      {filteredNotifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkRead={() => markAsRead(notification.id)}
          onToggleImportant={() => toggleImportant(notification.id)}
        />
      ))}
    </div>
  );
}
```

### Step 3: Create Notification Item
```tsx
// src/components/features/notifications/notification-item.tsx
import type { Notification } from '../../../types';

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: () => void;
  onToggleImportant: () => void;
}

const typeIcons: Record<string, string> = {
  alert: '⚠️',
  success: '✅',
  crud: '📋',
  system: '⚙️',
};

export function NotificationItem({ notification, onMarkRead, onToggleImportant }: NotificationItemProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`notification-item ${notification.isRead ? 'read' : 'unread'} ${notification.isImportant ? 'important' : ''}`}>
      <div className="notification-icon">{typeIcons[notification.type]}</div>
      <div className="notification-content">
        <div className="notification-header">
          <span className="notification-title">{notification.title}</span>
          {notification.isImportant && <span className="star">⭐</span>}
        </div>
        <p className="notification-message">{notification.message}</p>
        <span className="notification-time">{formatDate(notification.createdAt)}</span>
      </div>
      <div className="notification-actions">
        {!notification.isRead && (
          <button className="btn-icon" onClick={onMarkRead} title="Đánh dấu đã đọc">
            ✓
          </button>
        )}
        <button
          className="btn-icon"
          onClick={onToggleImportant}
          title={notification.isImportant ? 'Bỏ quan trọng' : 'Đánh dấu quan trọng'}
        >
          {notification.isImportant ? '★' : '☆'}
        </button>
      </div>
    </div>
  );
}
```

### Step 4: Create Important Events Panel
```tsx
// src/components/features/notifications/important-events-panel.tsx
import { useSettingsStore } from '../../../stores';

interface ImportantEventsPanelProps {
  onClose: () => void;
}

const eventTypes = [
  { id: 'alert', label: '⚠️ Cảnh báo phát hiện từ khóa' },
  { id: 'success', label: '✅ Hoàn thành transcription' },
  { id: 'create', label: '📁 Tạo sự vụ mới' },
  { id: 'update', label: '✏️ Cập nhật dữ liệu' },
  { id: 'delete', label: '🗑️ Xóa dữ liệu' },
  { id: 'export', label: '📤 Export báo cáo' },
  { id: 'import', label: '📥 Import dữ liệu' },
  { id: 'login', label: '🔐 Đăng nhập/Đăng xuất' },
];

export function ImportantEventsPanel({ onClose }: ImportantEventsPanelProps) {
  const { importantEvents, updateImportantEvents, resetImportantEvents } = useSettingsStore();

  const toggle = (id: keyof typeof importantEvents) => {
    updateImportantEvents({ [id]: !importantEvents[id] });
  };

  return (
    <div className="important-events-panel">
      <div className="important-events-header">
        <h3>⭐ Cấu hình sự kiện quan trọng</h3>
        <button className="btn-icon" onClick={onClose}>✕</button>
      </div>
      <p className="important-events-desc">
        Chọn các loại sự kiện bạn muốn được đánh dấu là quan trọng:
      </p>
      <div className="important-events-options">
        {eventTypes.map(event => (
          <label key={event.id} className="checkbox-label">
            <input
              type="checkbox"
              checked={importantEvents[event.id as keyof typeof importantEvents]}
              onChange={() => toggle(event.id as keyof typeof importantEvents)}
            />
            <span>{event.label}</span>
          </label>
        ))}
      </div>
      <div className="important-events-footer">
        <button className="btn btn-secondary btn-sm" onClick={resetImportantEvents}>
          Đặt mặc định
        </button>
        <button className="btn btn-primary btn-sm" onClick={onClose}>
          Xong
        </button>
      </div>
    </div>
  );
}
```

### Step 5: Create Logs Page
```tsx
// src/pages/logs.tsx
import { useState } from 'react';
import { LogsTable } from '../components/features/logs/logs-table';

export function LogsPage() {
  const [filters, setFilters] = useState({
    date: '',
    action: '',
  });

  return (
    <div id="page-logs" className="page active">
      <div className="page-header">
        <h1>Nhật ký hoạt động</h1>
        <div className="header-actions">
          <input
            type="date"
            className="date-filter"
            value={filters.date}
            onChange={(e) => setFilters(f => ({ ...f, date: e.target.value }))}
          />
          <select
            className="action-filter"
            value={filters.action}
            onChange={(e) => setFilters(f => ({ ...f, action: e.target.value }))}
          >
            <option value="">Tất cả hành động</option>
            <option value="login">Đăng nhập</option>
            <option value="create">Tạo mới</option>
            <option value="edit">Chỉnh sửa</option>
            <option value="delete">Xóa</option>
            <option value="export">Export</option>
          </select>
          <button className="btn btn-secondary">📤 Export</button>
        </div>
      </div>

      <LogsTable filters={filters} />
    </div>
  );
}
```

### Step 6: Create Logs Table
```tsx
// src/components/features/logs/logs-table.tsx
interface LogsTableProps {
  filters: {
    date: string;
    action: string;
  };
}

interface ActivityLog {
  timestamp: string;
  user: string;
  action: 'create' | 'edit' | 'export' | 'login';
  target: string;
}

const mockLogs: ActivityLog[] = [
  { timestamp: '22/01/2026 13:45:00', user: 'Admin', action: 'create', target: 'Sự vụ VV-2026-015' },
  { timestamp: '22/01/2026 13:30:00', user: 'Trần Điều Tra', action: 'edit', target: 'Transcript audio_001' },
  { timestamp: '22/01/2026 13:00:00', user: 'Admin', action: 'export', target: 'Sự vụ VV-2026-014' },
  { timestamp: '22/01/2026 12:00:00', user: 'Trần Điều Tra', action: 'login', target: '-' },
];

const actionLabels: Record<string, { label: string; className: string }> = {
  create: { label: 'Tạo', className: 'create' },
  edit: { label: 'Sửa', className: 'edit' },
  export: { label: 'Export', className: 'export' },
  login: { label: 'Đăng nhập', className: 'login' },
};

export function LogsTable({ filters }: LogsTableProps) {
  const filteredLogs = mockLogs.filter(log => {
    if (filters.action && log.action !== filters.action) return false;
    return true;
  });

  return (
    <div className="logs-table">
      <table>
        <thead>
          <tr>
            <th>Thời gian</th>
            <th>Người dùng</th>
            <th>Hành động</th>
            <th>Đối tượng</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log, index) => (
            <tr key={index}>
              <td>{log.timestamp}</td>
              <td>{log.user}</td>
              <td>
                <span className={`log-action ${actionLabels[log.action].className}`}>
                  {actionLabels[log.action].label}
                </span>
              </td>
              <td>{log.target}</td>
              <td>
                {log.target !== '-' && (
                  <button className="btn btn-sm">Xem</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Todo

- [ ] Create notifications/ folder
- [ ] Create notification-list.tsx
- [ ] Create notification-item.tsx
- [ ] Create important-events-panel.tsx
- [ ] Create logs/ folder
- [ ] Create logs-table.tsx
- [ ] Create notifications.tsx page
- [ ] Create logs.tsx page
- [ ] Add notification CSS styles

## Success Criteria

1. ✅ Notification list renders
2. ✅ Type filter works
3. ✅ Mark as read works
4. ✅ Important events config saves
5. ✅ Logs table displays
6. ✅ Logs filter works

## Next Steps

After completing this phase:
1. Proceed to [Phase 12: Polish UI](phase-12-polish.md)
