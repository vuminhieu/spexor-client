import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { ActivityLog } from '../../../types';

export function ActivityTable() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const logs = await invoke<ActivityLog[]>('get_activity_logs');
        setActivities(logs.slice(0, 5)); // Only show last 5
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const actionLabels: Record<string, string> = {
    login: 'Đăng nhập',
    create: 'Tạo mới',
    edit: 'Chỉnh sửa',
    delete: 'Xóa',
    export: 'Xuất file',
    import: 'Nhập file',
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="card activity-table-card">
      <div className="card-header-row">
        <h3>Hoạt động gần đây ({activities.length})</h3>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : activities.length === 0 ? (
        <div className="empty-state-small">
          <p className="text-muted">Chưa có hoạt động nào được ghi nhận</p>
        </div>
      ) : (
        <table className="activity-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Thao tác</th>
              <th>Đối tượng</th>
              <th>Chi tiết</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr key={activity.id}>
                <td>{String(index + 1).padStart(2, '0')}</td>
                <td>
                  <span className={`action-badge action-${activity.action}`}>
                    {actionLabels[activity.action] || activity.action}
                  </span>
                </td>
                <td>{activity.targetType}</td>
                <td>{activity.details || '-'}</td>
                <td>{formatDate(activity.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
