import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { ThemeContext } from '../context/ThemeContext';
import { 
  Plus, Compass, LayoutDashboard, Shield, Bell, LogOut, Sun, Moon, Sparkles, User, Bookmark, PenSquare 
} from 'lucide-react';

export const WpAdminBar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.email?.includes('admin');

  return (
    <div className="wp-admin-bar">
      <div className="wp-admin-bar-container">
        {/* Left Side: WP Logo, My Site, Write */}
        <div className="wp-admin-left">
          <Link to="/" className="wp-admin-brand" title="WordPress Home">
            <span className="wp-logo-circle">W</span>
            <span className="wp-brand-text">WordPress</span>
          </Link>

          <div className="wp-admin-item-wrapper">
            <Link to="/dashboard" className="wp-admin-item">
              <LayoutDashboard size={14} />
              <span>My Site</span>
            </Link>
          </div>

          <div className="wp-admin-item-wrapper">
            <Link to="/explore" className="wp-admin-item">
              <Compass size={14} />
              <span>Reader</span>
            </Link>
          </div>

          <div className="wp-admin-item-wrapper">
            <Link to="/create-blog" className="wp-admin-write-btn">
              <Plus size={14} />
              <span>Write</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Admin Command Center, Notifications, User Profile */}
        <div className="wp-admin-right">
          {isAdmin && (
            <Link to="/admin" className="wp-admin-item wp-admin-badge-admin">
              <Shield size={14} />
              <span>WP Admin</span>
            </Link>
          )}

          <button onClick={toggleTheme} className="wp-admin-item" title="Toggle Mode">
            {theme === 'dark' ? <Sun size={14} className="text-yellow" /> : <Moon size={14} />}
          </button>

          <Link to="/notifications" className="wp-admin-item relative" title="Notifications">
            <Bell size={14} />
            {unreadCount > 0 && <span className="wp-admin-notif-dot">{unreadCount}</span>}
          </Link>

          <div className="wp-admin-user-menu">
            <Link to="/profile" className="wp-admin-user-link">
              <img 
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
                alt="Avatar" 
                className="wp-admin-avatar" 
              />
              <span className="wp-admin-username">{user?.name || user?.username || 'Creator'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WpAdminBar;
