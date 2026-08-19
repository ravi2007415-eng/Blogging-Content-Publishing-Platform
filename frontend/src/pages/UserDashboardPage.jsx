import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CategoryContext } from '../context/CategoryContext';
import { BlogCard } from '../components/BlogCard';
import { MOCK_BLOGS } from '../mockData';
import { User, Bookmark, Bell, Layers, Check, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const { categories } = useContext(CategoryContext);
  const [followedCats, setFollowedCats] = useState(['Sports', 'Technology', 'Events']);

  const toggleFollow = (catName) => {
    setFollowedCats(prev => 
      prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
    );
  };

  const personalizedPosts = MOCK_BLOGS.filter(b => 
    followedCats.some(fc => fc.toLowerCase() === b.category?.name.toLowerCase())
  );

  return (
    <div className="page-container user-dashboard-page">
      
      {/* Hero Header */}
      <div className="user-hero-panel glass-panel mb-6">
        <div className="user-profile-row flex items-center gap-4">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={user?.name || 'User'}
            className="avatar-xl"
          />
          <div>
            <span className="badge badge-cyan text-xs mb-1">{user?.role || 'READER'}</span>
            <h1 className="hero-title">{user?.name || 'Alex Rivera'}</h1>
            <p className="text-sm text-muted">{user?.email || 'user@keryx.dev'}</p>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Personalized Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="section-header flex justify-between items-center">
            <h2 className="section-title flex items-center gap-2">
              <Sparkles size={20} className="text-cyan" />
              <span>Personalized Feed ({personalizedPosts.length})</span>
            </h2>
          </div>

          <div className="blogs-grid">
            {personalizedPosts.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>

        {/* Right Column: Followed Categories & Sub-Categories */}
        <div className="space-y-6">
          <div className="user-card glass-panel">
            <h3 className="card-title flex items-center gap-2 mb-3">
              <Layers size={18} className="text-pink" />
              <span>Follow Categories</span>
            </h3>
            <p className="text-xs text-muted mb-4">
              Select topics to customize your home feed updates and event notifications.
            </p>

            <div className="space-y-2">
              {categories.map(cat => {
                const isFollowed = followedCats.includes(cat.name);
                return (
                  <div key={cat.id} className="flex justify-between items-center p-2 rounded-lg glass-panel">
                    <span className="text-sm font-semibold">{cat.name}</span>
                    <button
                      onClick={() => toggleFollow(cat.name)}
                      className={`btn btn-xs ${isFollowed ? 'btn-primary' : 'btn-outline'}`}
                    >
                      {isFollowed ? 'Following' : '+ Follow'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="user-card glass-panel">
            <h3 className="card-title flex items-center gap-2 mb-3">
              <Bookmark size={18} className="text-yellow" />
              <span>Quick Links</span>
            </h3>
            <div className="space-y-2">
              <Link to="/bookmarks" className="btn btn-outline w-full text-center">
                View Saved Bookmarks
              </Link>
              <Link to="/events" className="btn btn-secondary w-full text-center">
                Explore Upcoming Events
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default UserDashboardPage;
