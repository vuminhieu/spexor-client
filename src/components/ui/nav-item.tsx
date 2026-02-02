import { useState } from 'react';
import type { Page } from '../../types';

interface NavItemProps {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
  badge?: number;
  submenu?: { id: string; icon: string; label: string }[];
  expanded?: boolean;
  onClick?: (id: Page) => void;
}

export function NavItem({
  id, icon, label, active, badge, submenu, expanded, onClick
}: NavItemProps) {
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const handleClick = () => {
    if (submenu) {
      setSubmenuOpen(!submenuOpen);
    } else {
      onClick?.(id as Page);
    }
  };

  return (
    <>
      <a
        href="#"
        className={`nav-item ${active ? 'active' : ''} ${submenu ? 'has-submenu' : ''}`}
        onClick={(e) => { e.preventDefault(); handleClick(); }}
        title={!expanded ? label : undefined}
      >
        <span className="nav-icon">{icon}</span>
        {expanded && (
          <>
            <span className="nav-text">{label}</span>
            {badge !== undefined && badge > 0 && <span className="badge">{badge}</span>}
            {submenu && <span className="nav-arrow">{submenuOpen ? '▲' : '▼'}</span>}
          </>
        )}
      </a>

      {submenu && submenuOpen && expanded && (
        <div className="submenu">
          {submenu.map((sub) => (
            <a
              key={sub.id}
              href="#"
              className="nav-item sub"
              onClick={(e) => { e.preventDefault(); onClick?.(sub.id as Page); }}
            >
              <span className="nav-icon">{sub.icon}</span>
              <span className="nav-text">{sub.label}</span>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
