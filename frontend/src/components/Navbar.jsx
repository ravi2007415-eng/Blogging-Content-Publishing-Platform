import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { CategoryContext } from '../context/CategoryContext';
import { NotificationContext } from '../context/NotificationContext';
import { 
  Sun, Moon, Search, PenSquare, Bookmark, User, LogOut, Layers, Home, 
  Calendar, Bell, Shield, ChevronDown, CheckCheck, Sparkles, Newspaper 
} from 'lucide-react';
import { SpeedMonogram } from './SpeedMonogram';

export const Navbar = ({ searchQuery, setSearchQuery }) => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { categories } = useContext(CategoryContext);
  const { notifications, unreadCount, markAllRead } = useContext(NotificationContext);

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery && searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.email?.includes('admin');

  return (
    <nav className="glass-panel sticky-nav">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="logo-icon speed-logo-wrapper">
            <SpeedMonogram size={28} />
          </div>
          <span className="logo-text">Keryx<span className="logo-dot">.</span></span>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-form">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="input-field search-input"
            placeholder="Search updates, sub-categories, sports, events..."
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Navigation Links */}
        <div className="nav-actions">
          <Link to="/" className="nav-link">
            <Home size={18} />
            <span>Home</span>
          </Link>

          <Link to="/news" className="nav-link">
            <Newspaper size={18} />
            <span>News</span>
          </Link>

          {/* Dynamic Category & Sub-Category Dropdown */}
          <div className="nav-dropdown-container">
            <button
              className="nav-link cat-dropdown-btn"
              onClick={() => {
                setCatDropdownOpen(!catDropdownOpen);
                setNotifDrawerOpen(false);
                setUserDropdownOpen(false);
              }}
            >
              <Layers size={18} />
              <span>Categories</span>
              <ChevronDown size={14} className={`chevron-icon ${catDropdownOpen ? 'rotate' : ''}`} />
            </button>

            {catDropdownOpen && (
              <div className="cat-dropdown-menu glass-panel shadow-2xl">
                <div className="cat-dropdown-header">
                  <span>Central Content Taxonomy</span>
                  <Link to="/explore" onClick={() => setCatDropdownOpen(false)} className="text-pink hover:underline text-xs">
                    View All
                  </Link>
                </div>
                <div className="cat-dropdown-grid">
                  {categories.slice(0, 8).map((cat) => (
                    <div key={cat.id} className="cat-dropdown-group">
                      <Link
                        to={`/category/${cat.slug}`}
                        className="cat-group-title"
                        onClick={() => setCatDropdownOpen(false)}
                      >
                        {cat.name}
                      </Link>
                      <div className="cat-sub-links">
                        {(cat.subCategories || []).slice(0, 4).map((sub) => (
                          <Link
                            key={sub.id}
                            to={`/category/${cat.slug}/${sub.slug}`}
                            className="cat-sub-link"
                            onClick={() => setCatDropdownOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Events Hub Link */}
          <Link to="/events" className="nav-link">
            <Calendar size={18} />
            <span>Events</span>
          </Link>

          {/* Real-time Notifications Bell Drawer */}
          <div className="nav-dropdown-container">
            <button
              className="nav-link icon-only relative"
              title="Real-time Notifications"
              onClick={() => {
                setNotifDrawerOpen(!notifDrawerOpen);
                setCatDropdownOpen(false);
                setUserDropdownOpen(false);
              }}
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="notif-badge">{unreadCount}</span>
              )}
            </button>

            {notifDrawerOpen && (
              <div className="notif-drawer glass-panel shadow-2xl">
                <div className="notif-drawer-header">
                  <div className="notif-header-title">
                    <Sparkles size={16} className="text-cyan" />
                    <h4>Live Updates Feed</h4>
                  </div>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="btn-text text-xs flex items-center gap-1">
                      <CheckCheck size={14} /> Mark all read
                    </button>
                  )}
                </div>

                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <p className="notif-empty">No updates yet.</p>
                  ) : (
                    notifications.map((n) => (
                      <Link
                        key={n.id}
                        to={n.link || '/'}
                        onClick={() => setNotifDrawerOpen(false)}
                        className={`notif-item ${!n.read ? 'unread' : ''}`}
                      >
                        <div className="notif-item-header">
                          <span className={`notif-type-tag type-${n.type?.toLowerCase()}`}>{n.type}</span>
                          <span className="notif-time">{n.timestamp}</span>
                        </div>
                        <h5 className="notif-item-title">{n.title}</h5>
                        <p className="notif-item-msg">{n.message}</p>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary icon-toggle"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} className="text-yellow" /> : <Moon size={18} />}
          </button>

          {/* User Auth & Role Dashboards */}
          {isAuthenticated ? (
            <div className="user-dropdown-container">
              <button
                className="avatar-btn"
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setCatDropdownOpen(false);
                  setNotifDrawerOpen(false);
                }}
              >
                <img
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={user?.name || 'User'}
                  className="avatar-img"
                />
              </button>

              {userDropdownOpen && (
                <div className="dropdown-menu glass-panel shadow-2xl">
                  <div className="dropdown-header">
                    <p className="user-name">{user?.name || 'Creator'}</p>
                    <p className="user-email">{user?.email || 'user@keryx.dev'}</p>
                    <span className="badge badge-primary text-xs mt-1">{user?.role || 'ROLE_AUTHOR'}</span>
                  </div>
                  <hr className="dropdown-divider" />

                  {/* Role Specific Dashboards */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="dropdown-item text-pink font-semibold"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Shield size={16} />
                      <span>Admin Command Center</span>
                    </Link>
                  )}

                  <Link
                    to="/dashboard"
                    className="dropdown-item"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <PenSquare size={16} />
                    <span>Author Studio</span>
                  </Link>

                  <Link
                    to="/user"
                    className="dropdown-item"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <User size={16} />
                    <span>User Dashboard</span>
                  </Link>

                  <Link
                    to="/bookmarks"
                    className="dropdown-item"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <Bookmark size={16} />
                    <span>Bookmarks</span>
                  </Link>

                  <hr className="dropdown-divider" />

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                      navigate('/');
                    }}
                    className="dropdown-item logout-btn"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
