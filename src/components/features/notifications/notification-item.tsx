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

const typeColors: Record<string, string> = {
  alert: '#ef4444',
  success: '#10b981',
  crud: '#3b82f6',
  system: '#6b7280',
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
    <div
      className={`notification-item ${notification.isRead ? 'read' : 'unread'} ${notification.isImportant ? 'important' : ''}`}
      style={{ borderLeftColor: typeColors[notification.type] || '#6b7280' }}
    >
      <div className="notification-icon">
        {typeIcons[notification.type] || '📢'}
      </div>
      <div className="notification-content">
        <div className="notification-header">
          <span className="notification-title">{notification.title}</span>
          {notification.isImportant && <span className="star">⭐</span>}
          {!notification.isRead && <span className="unread-dot" />}
        </div>
        <p className="notification-message">{notification.message}</p>
        <span className="notification-time">{formatDate(notification.createdAt)}</span>
      </div>
      <div className="notification-actions">
        {!notification.isRead && (
          <button
            className="btn-icon"
            onClick={onMarkRead}
            title="Đánh dấu đã đọc"
          >
            ✓
          </button>
        )}
        <button
          className={`btn-icon ${notification.isImportant ? 'active' : ''}`}
          onClick={onToggleImportant}
          title={notification.isImportant ? 'Bỏ quan trọng' : 'Đánh dấu quan trọng'}
        >
          {notification.isImportant ? '★' : '☆'}
        </button>
      </div>
    </div>
  );
}
