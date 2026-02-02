import { useState } from 'react';
import { useUIStore } from '../stores';
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
    <div className="page notifications-page">
      <div className="page-header">
        <div>
          <h1>🔔 Thông báo</h1>
          <p className="page-description">
            Xem và quản lý các thông báo từ hệ thống
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={markAllRead}>
            ✓ Đánh dấu tất cả đã đọc
          </button>
        </div>
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
        <button className="btn btn-sm" onClick={resetFilters}>
          🔄 Đặt lại
        </button>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => setShowImportantPanel(true)}
        >
          ⭐ Sự kiện quan trọng
        </button>
      </div>

      <div className="page-content">
        <NotificationList filters={filters} />
      </div>

      {showImportantPanel && (
        <ImportantEventsPanel onClose={() => setShowImportantPanel(false)} />
      )}
    </div>
  );
}
