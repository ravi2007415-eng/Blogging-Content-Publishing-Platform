import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MOCK_BLOGS } from '../mockData';
import { BlogCard } from '../components/BlogCard';
import { User, Mail, PenSquare, Heart, Bookmark, Layers, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('published');

  const myBlogs = MOCK_BLOGS.filter(b => b.author?.email === user?.email || b.author?.id === user?.id || true);
  const bookmarkedBlogs = MOCK_BLOGS.filter(b => b.isBookmarked);

  return (
    <div className="profile-page-container">
      {/* Profile Header Banner */}
      <div className="profile-banner glass-panel">
        <div className="profile-main-info">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={user?.name || 'User'}
            className="profile-avatar-xl"
          />
          <div className="profile-text">
            <h2>{user?.name || 'Alex Rivera'}</h2>
            <p className="profile-email">
              <Mail size={14} /> {user?.email || 'alex@nexus.dev'}
            </p>
            <div className="profile-role-badge badge badge-primary">
              <ShieldCheck size={14} />
              <span>{user?.role || 'ROLE_AUTHOR'}</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/write" className="btn btn-primary">
            <PenSquare size={18} />
            <span>Write Article</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs-bar">
        <button
          className={`tab-btn ${activeTab === 'published' ? 'active' : ''}`}
          onClick={() => setActiveTab('published')}
        >
          <PenSquare size={16} />
          <span>My Articles ({myBlogs.length})</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'bookmarks' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookmarks')}
        >
          <Bookmark size={16} />
          <span>Bookmarks ({bookmarkedBlogs.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <section className="feed-section">
        <div className="blogs-grid">
          {activeTab === 'published'
            ? myBlogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
            : bookmarkedBlogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
        </div>
      </section>
    </div>
  );
};
