import React from 'react';
import '../styles/wp-dashboard.css';

/**
 * WordPress.com (Calypso) style dashboard shell.
 * Left sidebar navigation + top bar + light card-based content area.
 *
 * Props:
 *  - eyebrow: small label above the title (e.g. "Admin Command Center")
 *  - title: main page title
 *  - subtitle: description under the title
 *  - icon: lucide-react icon component shown top-right
 *  - navItems: [{ id, label, icon, count }]
 *  - activeTab: current active nav item id
 *  - onTabChange: (id) => void
 *  - children: tab content
 */
export const DashboardLayout = ({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  navItems = [],
  activeTab,
  onTabChange,
  children,
}) => {
  return (
    <div className="wpc-shell">
      {/* Sidebar */}
      <aside className="wpc-sidebar">
        <div className="wpc-sidebar-brand">
          <span className="wpc-logo-dot" />
          <span className="wpc-logo-text">Keryx</span>
        </div>

        <nav className="wpc-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`wpc-nav-item ${activeTab === item.id ? 'is-active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              {item.icon && <item.icon size={18} />}
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span className="wpc-nav-count">{item.count}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="wpc-main">
        <header className="wpc-topbar">
          <div>
            {eyebrow && <span className="wpc-eyebrow">{eyebrow}</span>}
            <h1 className="wpc-page-title">{title}</h1>
            {subtitle && <p className="wpc-page-subtitle">{subtitle}</p>}
          </div>
          {Icon && (
            <div className="wpc-topbar-icon">
              <Icon size={20} />
            </div>
          )}
        </header>

        <div className="wpc-content">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
