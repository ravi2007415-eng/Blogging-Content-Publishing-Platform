import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { blogApi } from '../api/blogApi';
import { MOCK_BLOGS } from '../mockData';
import { BlogCard } from '../components/BlogCard';
import { Mail, PenSquare, Bookmark, ShieldCheck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfilePage = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('published');
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserArticles = async () => {
      if (!isAuthenticated) return;
      setLoading(true);
      try {
        const data = await blogApi.getMyBlogs();
        setMyBlogs(Array.isArray(data) ? data : []);
      } catch {
        const fallback = MOCK_BLOGS.filter(b => b.author?.email === user?.email || b.author?.id === user?.id || true);
        setMyBlogs(fallback);
      } finally {
        setLoading(false);
      }
    };
    fetchUserArticles();
  }, [isAuthenticated, user]);

  const bookmarkedBlogs = MOCK_BLOGS.filter(b => b.isBookmarked);


  return (
    <div className="profile-page-container space-y-6">
      {/* Profile Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm flex flex-wrap justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={user?.name || 'User'}
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-xs"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
            }}
          />
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900">{user?.name || 'Alex Rivera'}</h1>
            <p className="text-sm text-slate-500 flex items-center gap-1.5">
              <Mail size={14} className="text-blue-600" /> {user?.email || 'alex@keryx.dev'}
            </p>
            <div className="pt-1">
              <span className="badge badge-primary inline-flex items-center gap-1 text-xs">
                <ShieldCheck size={13} />
                <span>{user?.role || 'ROLE_AUTHOR'}</span>
              </span>
            </div>
          </div>
        </div>

        <div>
          <Link to="/write" className="btn btn-primary inline-flex items-center gap-2">
            <PenSquare size={16} />
            <span>Write New Story</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-slate-200 pb-3">
        <button
          className={`pill-btn text-xs inline-flex items-center gap-1.5 ${activeTab === 'published' ? 'active' : ''}`}
          onClick={() => setActiveTab('published')}
        >
          <PenSquare size={14} />
          <span>My Articles ({myBlogs.length})</span>
        </button>

        <button
          className={`pill-btn text-xs inline-flex items-center gap-1.5 ${activeTab === 'bookmarks' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookmarks')}
        >
          <Bookmark size={14} />
          <span>Bookmarks ({bookmarkedBlogs.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <section>
        <div className="blogs-grid">
          {activeTab === 'published'
            ? myBlogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
            : bookmarkedBlogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
