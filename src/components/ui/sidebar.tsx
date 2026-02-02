import { useUIStore, useNotificationStore } from '../../stores';
import { NavItem } from './nav-item';
import { UserProfile } from './user-profile';
import type { Page } from '../../types';
import { useEffect } from 'react';

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

export function Sidebar() {
  const { currentPage, setPage, sidebarExpanded, toggleSidebar } = useUIStore();
  const { unreadCount, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const footerItems = [
    { id: 'notifications', icon: '🔔', label: 'Thông báo', badge: unreadCount },
    { id: 'support', icon: '❓', label: 'Hỗ trợ' },
  ];

  return (
    <aside className={`sidebar ${sidebarExpanded ? '' : 'collapsed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <img src="/icons/logo.png" alt="SPEXOR" className="logo-img" />
          {sidebarExpanded && <span className="logo-text">SPEXOR</span>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          title={sidebarExpanded ? 'Thu gọn' : 'Mở rộng'}
        >
          {sidebarExpanded ? '◀' : '▶'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            {...item}
            active={currentPage === item.id ||
              item.submenu?.some(sub => sub.id === currentPage)}
            onClick={(id) => setPage(id as Page)}
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
            onClick={(id) => setPage(id as Page)}
            expanded={sidebarExpanded}
          />
        ))}
        <UserProfile expanded={sidebarExpanded} />
      </div>
    </aside>
  );
}
