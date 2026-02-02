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
    message: 'Sự vụ VV-2026-015 đã được tạo bởi Admin',
    entityType: 'case',
    entityId: 15,
    isRead: true,
    isImportant: true,
    createdAt: '2026-01-22T13:00:00Z',
  },
  {
    id: 4,
    type: 'system',
    action: 'system',
    title: 'Cập nhật hệ thống',
    message: 'Phiên bản mới 1.2.0 đã sẵn sàng',
    entityType: 'system',
    entityId: 0,
    isRead: true,
    isImportant: false,
    createdAt: '2026-01-22T10:00:00Z',
  },
];

export function NotificationList({ filters }: NotificationListProps) {
  const [notifications, setNotifications] = useState(mockNotifications);

  const filteredNotifications = notifications.filter(n => {
    if (filters.type !== 'all' && n.type !== filters.type) return false;
    // Date filtering could be added here
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

  const unreadCount = filteredNotifications.filter(n => !n.isRead).length;

  if (filteredNotifications.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔔</div>
        <h3>Không có thông báo</h3>
        <p>Không có thông báo nào phù hợp với bộ lọc.</p>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      {unreadCount > 0 && (
        <div className="notifications-summary">
          <span>Bạn có <strong>{unreadCount}</strong> thông báo chưa đọc</span>
        </div>
      )}
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
    </div>
  );
}
