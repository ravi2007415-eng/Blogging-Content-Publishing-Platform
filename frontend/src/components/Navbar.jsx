import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon, Feather, Search, PenSquare, Bookmark, User, LogOut, Layers, Home } from 'lucide-react';

export const Navbar = ({ searchQuery, setSearchQuery }) => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery && searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="glass-panel sticky-nav">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="logo-icon">
            <Feather className="icon-feather" />
          </div>
          <span className="logo-text">Nexus<span className="logo-dot">.</span></span>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-form">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="input-field search-input"
            placeholder="Search articles, tags, authors..."
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Navigation Links */}
        <div className="nav-actions">
          <Link to="/" className="nav-link">
            <Home size={18} />
            <span>Feed</span>
          </Link>
          <Link to="/explore" className="nav-link">
            <Layers size={18} />
            <span>Explore</span>
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/write" className="btn btn-primary nav-write-btn">
                <PenSquare size={18} />
                <span>Write</span>
              </Link>
              <Link to="/bookmarks" className="nav-link icon-only" title="Bookmarks">
                <Bookmark size={20} />
              </Link>
            </>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary icon-toggle"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} className="text-yellow" /> : <Moon size={18} />}
          </button>

          {/* Auth Controls / User Profile */}
          {isAuthenticated ? (
            <div className="user-dropdown-container">
              <button
                className="avatar-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <img
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={user?.name || 'User'}
                  className="avatar-img"
                />
              </button>

              {userDropdownOpen && (
                <div className="dropdown-menu glass-panel">
                  <div className="dropdown-header">
                    <p className="user-name">{user?.name || 'Developer'}</p>
                    <p className="user-email">{user?.email || 'user@nexus.dev'}</p>
                  </div>
                  <hr className="dropdown-divider" />
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <User size={16} />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className="dropdown-item"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <PenSquare size={16} />
                    <span>My Articles</span>
                  </Link>
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
