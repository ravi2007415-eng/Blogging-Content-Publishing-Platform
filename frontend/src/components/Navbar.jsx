import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CategoryContext } from '../context/CategoryContext';
import { NotificationContext } from '../context/NotificationContext';
import { 
  PenSquare, User, LogOut,
  Bell, Shield, ChevronDown, CheckCheck, Sparkles, Search, Menu, X 
} from 'lucide-react';
import { SpeedMonogram } from './SpeedMonogram';

export const Navbar = ({ searchQuery, setSearchQuery }) => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { categories } = useContext(CategoryContext);
  const { notifications, unreadCount, markAllRead } = useContext(NotificationContext);

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery || '');

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearch && localSearch.trim()) {
      if (setSearchQuery) setSearchQuery(localSearch.trim());
      navigate(`/?q=${encodeURIComponent(localSearch.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.email?.includes('admin');

  return (
    <nav className="blue-navbar sticky-nav">
      <div className="nav-container">
        
        {/* LEFT: Brand Logo */}
        <Link to="/" className="blue-brand-logo" onClick={() => { if (setSearchQuery) setSearchQuery(''); }}>
          <div className="blue-logo-icon">
            <SpeedMonogram size={20} />
          </div>
          <span className="blue-logo-text">Keryx<span className="logo-dot">.</span></span>
        </Link>

        {/* CENTER: Navigation Links */}
        <div className="nav-center-links">
          <Link 
            to="/" 
            className={`nav-link-item ${location.pathname === '/' && !location.search ? 'active' : ''}`}
            onClick={() => { if (setSearchQuery) setSearchQuery(''); }}
          >
            Home
          </Link>

          <Link 
            to="/news" 
            className={`nav-link-item ${location.pathname.startsWith('/news') ? 'active' : ''}`}
          >
            News
          </Link>

          {/* Categories Dropdown */}
          <div className="nav-dropdown-container">
            <button
              className={`nav-link-item dropdown-toggle-btn ${location.pathname.startsWith('/category') ? 'active' : ''}`}
              onClick={() => {
                setCatDropdownOpen(!catDropdownOpen);
                setNotifDrawerOpen(false);
                setUserDropdownOpen(false);
              }}
              aria-expanded={catDropdownOpen}
            >
              <span>Categories</span>
              <ChevronDown size={14} className={`chevron-icon ${catDropdownOpen ? 'rotate' : ''}`} />
            </button>

            {catDropdownOpen && (
              <div className="cat-dropdown-menu">
                <div className="cat-dropdown-header">
                  <span>Explore Channels & Topics</span>
                  <Link 
                    to="/explore" 
                    onClick={() => setCatDropdownOpen(false)} 
                    className="text-blue text-xs hover:underline font-semibold"
                  >
                    View All →
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
                        {(cat.subCategories || []).slice(0, 3).map((sub) => (
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

          <Link 
            to="/events" 
            className={`nav-link-item ${location.pathname.startsWith('/events') ? 'active' : ''}`}
          >
            Events
          </Link>
        </div>

        {/* RIGHT: Search, Notifications & Auth Actions */}
        <div className="nav-right-actions">
          
          {/* Quick Search Input */}
          <form onSubmit={handleSearchSubmit} className="nav-search-box hidden md:flex">
            <Search size={14} className="nav-search-icon" />
            <input
              type="text"
              className="nav-search-input"
              placeholder="Search articles..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </form>

          {isAuthenticated ? (
            <div className="logged-in-group">
              
              {/* Write Article Shortcut */}
              <Link to="/write" className="btn btn-sm btn-outline hidden sm:inline-flex" title="Write a Story">
                <PenSquare size={14} />
                <span>Write</span>
              </Link>

              {/* Real-time Notifications Bell */}
              <div className="nav-dropdown-container">
                <button
                  className="nav-icon-btn"
                  title="Real-time Notifications"
                  onClick={() => {
                    setNotifDrawerOpen(!notifDrawerOpen);
                    setCatDropdownOpen(false);
                    setUserDropdownOpen(false);
                  }}
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="notif-badge">{unreadCount}</span>
                  )}
                </button>

                {notifDrawerOpen && (
                  <div className="notif-drawer">
                    <div className="notif-drawer-header">
                      <div className="notif-header-title">
                        <Sparkles size={16} className="text-blue" />
                        <span>Live Updates Feed</span>
                      </div>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="btn-text text-xs flex items-center gap-1 text-blue font-semibold hover:underline">
                          <CheckCheck size={14} /> Mark read
                        </button>
                      )}
                    </div>

                    <div className="notif-list">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-muted text-center py-4">No new updates right now.</p>
                      ) : (
                        notifications.map((n) => (
                          <Link
                            key={n.id}
                            to={n.link || '/'}
                            onClick={() => setNotifDrawerOpen(false)}
                            className={`notif-item ${!n.read ? 'unread' : ''}`}
                          >
                            <div className="notif-item-header">
                              <span className="notif-type-tag">{n.type}</span>
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

              {/* User Profile Dropdown */}
              <div className="user-dropdown-container">
                <button
                  className="avatar-btn"
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setCatDropdownOpen(false);
                    setNotifDrawerOpen(false);
                  }}
                  aria-label="User Menu"
                >
                  <img
                    src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user?.name || 'User'}
                    className="avatar-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
                    }}
                  />
                </button>

                {userDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <p className="user-name">{user?.name || 'Alex Rivera'}</p>
                      <p className="user-email">{user?.email || 'alex@keryx.dev'}</p>
                      <span className="badge badge-primary text-xs mt-1.5">{user?.role || 'ROLE_AUTHOR'}</span>
                    </div>
                    <hr className="dropdown-divider" />

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="dropdown-item text-blue font-semibold"
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

            </div>
          ) : (
            <div className="auth-group">
              <Link to="/login" className="nav-login-btn">
                Sign In
              </Link>
              <Link to="/register" className="nav-register-btn">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button 
            className="nav-icon-btn md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer md:hidden bg-white border-b border-slate-200 p-4 absolute top-[72px] left-0 right-0 shadow-lg z-50">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <input
              type="text"
              className="input-field"
              placeholder="Search articles, topics..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </form>
          <div className="flex flex-col gap-2">
            <Link 
              to="/" 
              className="p-2 font-semibold text-slate-700 hover:text-blue-600 rounded"
              onClick={() => { setMobileMenuOpen(false); if (setSearchQuery) setSearchQuery(''); }}
            >
              Home
            </Link>
            <Link 
              to="/news" 
              className="p-2 font-semibold text-slate-700 hover:text-blue-600 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              News
            </Link>
            <Link 
              to="/explore" 
              className="p-2 font-semibold text-slate-700 hover:text-blue-600 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore Channels
            </Link>
            <Link 
              to="/events" 
              className="p-2 font-semibold text-slate-700 hover:text-blue-600 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            {!isAuthenticated && (
              <div className="flex gap-2 pt-2 border-t border-slate-200 mt-2">
                <Link to="/login" className="btn btn-secondary flex-1 text-center" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary flex-1 text-center" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
