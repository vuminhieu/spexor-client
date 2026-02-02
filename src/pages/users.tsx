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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await invoke<User[]>('get_users');
      setUsers(data);
    } catch (error) {
      console.error(error);
      // Use mock data for now
      setUsers([
        { id: 1, name: 'Nguyễn Văn Admin', email: 'admin@spexor.local', role: 'admin', avatar: null, createdAt: '2026-01-01' },
        { id: 2, name: 'Trần Văn Điều Tra', email: 'tran.dieutra@spexor.local', role: 'investigator', avatar: null, createdAt: '2026-01-05' },
        { id: 3, name: 'Lê Thị Xem', email: 'le.xem@spexor.local', role: 'viewer', avatar: null, createdAt: '2026-01-10' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    showToast('info', `Sửa thông tin: ${user.name}`);
    openModal('user-modal');
  };

  const handleResetPassword = (user: User) => {
    showToast('info', `Reset mật khẩu cho: ${user.name}`);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page users-page">
      <div className="page-header">
        <div>
          <h1>👥 Quản lý người dùng</h1>
          <p className="page-description">
            Quản lý tài khoản người dùng và phân quyền trong hệ thống
          </p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={() => openModal('user-modal')}
          >
            ➕ Thêm người dùng
          </button>
        </div>
      </div>

      <div className="page-content">
        {loading ? (
          <div className="loading-state">
            <span className="loading-spinner">⏳</span>
            <p>Đang tải danh sách người dùng...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>Không tìm thấy người dùng</h3>
            <p>Thử thay đổi từ khóa tìm kiếm hoặc thêm người dùng mới.</p>
          </div>
        ) : (
          <div className="users-grid">
            {filteredUsers.map(user => (
              <div key={user.id} className="user-card">
                <div className={`user-avatar ${roleColors[user.role]}`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <span className={`role-badge ${roleColors[user.role]}`}>
                    {roleLabels[user.role] || user.role}
                  </span>
                  <p className="user-email">{user.email}</p>
                </div>
                <div className="user-actions">
                  <button
                    className="btn-icon"
                    title="Sửa"
                    onClick={() => handleEdit(user)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon"
                    title="Đổi mật khẩu"
                    onClick={() => handleResetPassword(user)}
                  >
                    🔑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
