import { useState } from 'react';
import { LogsTable } from '../components/features/logs/logs-table';
import { useUIStore } from '../stores';

export function LogsPage() {
  const { showToast } = useUIStore();
  const [filters, setFilters] = useState({
    date: '',
    action: '',
  });

  const handleExport = () => {
    showToast('info', 'Đang xuất nhật ký...');
  };

  const resetFilters = () => {
    setFilters({ date: '', action: '' });
  };

  return (
    <div className="page logs-page">
      <div className="page-header">
        <div>
          <h1>📋 Nhật ký hoạt động</h1>
          <p className="page-description">
            Theo dõi mọi hoạt động trong hệ thống
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleExport}>
            📤 Export
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="logs-filters">
        <div className="filter-group">
          <label>Ngày:</label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters(f => ({ ...f, date: e.target.value }))}
          />
        </div>
        <div className="filter-group">
          <label>Hành động:</label>
          <select
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
        </div>
        <button className="btn btn-sm" onClick={resetFilters}>
          🔄 Đặt lại
        </button>
      </div>

      <div className="page-content">
        <LogsTable filters={filters} />
      </div>
    </div>
  );
}
