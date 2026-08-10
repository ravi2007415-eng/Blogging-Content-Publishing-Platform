import React, { useState, useEffect, useContext } from 'react';
import { CategoryContext } from '../context/CategoryContext';
import { blogApi } from '../api/blogApi';
import { BlogCard } from '../components/BlogCard';
import { Compass, BookMarked, Rss, Flame, Sparkles, LayoutGrid, List } from 'lucide-react';

export const ExplorePage = () => {
  const { categories } = useContext(CategoryContext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' | 'following' | 'saved'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchReaderBlogs = async () => {
      setLoading(true);
      try {
        let res;
        if (selectedCategory) {
          res = await blogApi.filterByCategory(selectedCategory);
        } else {
          res = await blogApi.getBlogs(0, 20);
        }
        const data = res.content || res;
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load WordPress Reader feeds:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReaderBlogs();
  }, [selectedCategory]);

  return (
    <div className="wp-reader-page space-y-8">
      {/* WordPress Reader Header */}
      <div className="wp-reader-header">
        <div className="wp-reader-title-wrap">
          <div className="wp-reader-icon">
            <Compass size={24} className="text-wp-blue" />
          </div>
          <div>
            <h1 className="wp-reader-title">Keryx Reader</h1>
            <p className="wp-reader-subtitle">
              Discover posts from across the Keryx network, follow your favorite authors, and save articles to read later.
            </p>
          </div>
        </div>

        {/* Reader Nav Tabs */}
        <div className="wp-reader-tabs-row">
          <div className="wp-reader-tabs">
            <button
              onClick={() => { setActiveTab('discover'); setSelectedCategory(null); }}
              className={`wp-reader-tab ${activeTab === 'discover' && !selectedCategory ? 'active' : ''}`}
            >
              <Sparkles size={16} />
              <span>Discover</span>
            </button>
            <button
              onClick={() => { setActiveTab('following'); }}
              className={`wp-reader-tab ${activeTab === 'following' ? 'active' : ''}`}
            >
              <Rss size={16} />
              <span>Following</span>
            </button>
            <button
              onClick={() => { setActiveTab('saved'); }}
              className={`wp-reader-tab ${activeTab === 'saved' ? 'active' : ''}`}
            >
              <BookMarked size={16} />
              <span>Saved Posts</span>
            </button>
          </div>

          <div className="wp-view-toggle">
            <button
              onClick={() => setViewMode('grid')}
              className={`wp-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`wp-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="wp-reader-categories">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`wp-reader-cat-pill ${selectedCategory === null ? 'active' : ''}`}
        >
          All Topics
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`wp-reader-cat-pill ${selectedCategory === cat.slug ? 'active' : ''}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Reader Feed Grid */}
      <div className="wp-reader-feed">
        {loading ? (
          <div className="wp-loading-state py-12">
            <div className="wp-spinner"></div>
            <span>Fetching WordPress Reader articles...</span>
          </div>
        ) : blogs.length > 0 ? (
          <div className={viewMode === 'grid' ? 'wp-grid-layout' : 'wp-list-layout'}>
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="wp-empty-state py-12">
            <p className="wp-empty-title">No articles found in this feed</p>
            <button onClick={() => setSelectedCategory(null)} className="btn btn-wp-primary mt-3">
              Explore All Discover Posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
