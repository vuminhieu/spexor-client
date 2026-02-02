import { useAuthStore } from '../../stores/authStore';

interface UserProfileProps {
  expanded: boolean;
}

const roleLabels: Record<string, string> = {
  admin: 'Quản trị viên',
  investigator: 'Điều tra viên',
  viewer: 'Người xem',
};

export function UserProfile({ expanded }: UserProfileProps) {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
    }
  };

  return (
    <div className={`user-profile ${expanded ? '' : 'collapsed'}`}>
      <div className="user-avatar">
        <span>{user?.name?.charAt(0).toUpperCase() || '👤'}</span>
      </div>
      {expanded && (
        <>
          <div className="user-info">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-role">{roleLabels[user?.role || 'viewer']}</span>
          </div>
          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Đăng xuất"
          >
            🚪
          </button>
        </>
      )}
    </div>
  );
}
