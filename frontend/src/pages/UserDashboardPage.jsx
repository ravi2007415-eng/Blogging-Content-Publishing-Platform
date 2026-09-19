import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CategoryContext } from '../context/CategoryContext';
import { BlogCard } from '../components/BlogCard';
import { MOCK_BLOGS } from '../mockData';
import { Bookmark, Layers, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const { categories } = useContext(CategoryContext);
  const [followedCats, setFollowedCats] = useState(['Sports', 'Technology', 'Events', 'AI & Machine Learning']);

  const toggleFollow = (catName) => {
    setFollowedCats(prev => 
      prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
    );
  };

  const personalizedPosts = MOCK_BLOGS.filter(b => 
    followedCats.some(fc => fc.toLowerCase() === b.category?.name.toLowerCase())
  );

  return (
    <div className="page-container user-dashboard-page space-y-6">
      
      {/* Hero Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={user?.name || 'User'}
            className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
            }}
          />
          <div>
            <span className="badge badge-primary text-xs mb-1">{user?.role || 'READER'}</span>
            <h1 className="text-2xl font-extrabold text-slate-900">{user?.name || 'Alex Rivera'}</h1>
            <p className="text-xs text-slate-500">{user?.email || 'user@keryx.dev'}</p>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Personalized Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles size={18} className="text-blue-600" />
              <span>Personalized Feed ({personalizedPosts.length})</span>
            </h2>
          </div>

          <div className="blogs-grid">
            {personalizedPosts.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>

        {/* Right Column: Followed Categories & Quick Links */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 mb-2">
              <Layers size={16} className="text-blue-600" />
              <span>Follow Channels</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select channels to customize your home feed and event notifications.
            </p>

            <div className="space-y-2">
              {categories.slice(0, 8).map(cat => {
                const isFollowed = followedCats.includes(cat.name);
                return (
                  <div key={cat.id} className="flex justify-between items-center p-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300 transition">
                    <span className="text-xs font-semibold text-slate-800">{cat.name}</span>
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

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 mb-3">
              <Bookmark size={16} className="text-blue-600" />
              <span>Quick Shortcuts</span>
            </h3>
            <div className="space-y-2">
              <Link to="/bookmarks" className="btn btn-outline w-full text-center text-xs justify-center">
                View Saved Bookmarks
              </Link>
              <Link to="/events" className="btn btn-secondary w-full text-center text-xs justify-center">
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
