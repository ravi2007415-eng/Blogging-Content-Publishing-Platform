import React, { useState, useEffect, useContext } from 'react';
import { CategoryContext } from '../context/CategoryContext';
import { blogApi } from '../api/blogApi';
import { eventApi } from '../api/eventApi';
import { BlogCard } from '../components/BlogCard';
import { LiveTicker } from '../components/LiveTicker';
import { 
  TrendingUp, SearchX, Calendar, Flame, ArrowRight, Layers, Newspaper, Sparkles, LayoutGrid, List, CheckCircle2, Globe, ShieldCheck, Zap 
} from 'lucide-react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';

export const HomePage = ({ searchQuery }) => {
  const { categories } = useContext(CategoryContext);
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [domainInput, setDomainInput] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlQuery = searchParams.get('q') || searchQuery || '';

  useEffect(() => {
    const loadHomePageData = async () => {
      setLoading(true);
      try {
        let blogData = [];
        if (urlQuery.trim()) {
          const searchRes = await blogApi.searchBlogs(urlQuery.trim());
          blogData = searchRes.content || searchRes;
        } else if (selectedCategory && selectedSubCategory) {
          blogData = await blogApi.getBlogsByCategoryAndSubCategory(selectedCategory, selectedSubCategory);
        } else if (selectedCategory) {
          const catRes = await blogApi.filterByCategory(selectedCategory);
          blogData = catRes.content || catRes;
        } else {
          const allRes = await blogApi.getBlogs(0, 20);
          blogData = allRes.content || allRes;
        }
        setBlogs(Array.isArray(blogData) ? blogData : []);

        const eventData = await eventApi.getEvents(selectedCategory, selectedSubCategory);
        setEvents(Array.isArray(eventData) ? eventData : []);
      } catch (err) {
        console.error('Failed to load homepage data from backend API:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomePageData();
  }, [selectedCategory, selectedSubCategory, urlQuery]);

  const handleDomainSubmit = (e) => {
    e.preventDefault();
    if (domainInput.trim()) {
      navigate(`/?q=${encodeURIComponent(domainInput.trim())}`);
    } else {
      navigate('/register');
    }
  };

  const currentCategoryObj = categories.find(c => String(c.slug).toLowerCase() === String(selectedCategory).toLowerCase());
  const availableSubCategories = currentCategoryObj ? (currentCategoryObj.subCategories || []) : [];

  const featuredBlog = blogs.find(b => b.status === 'PUBLISHED') || blogs[0];

  return (
    <div className="wp-home-page space-y-12">
      
      {/* Breaking News Ticker */}
      <LiveTicker />

      {/* WordPress.com Hero Section */}
      {!selectedCategory && !urlQuery && (
        <section className="wp-hero-section">
          <div className="wp-hero-badge">
            <Sparkles size={15} className="text-wp-blue" />
            <span>Welcome to WordPress.com</span>
          </div>

          <h1 className="wp-hero-title">
            Build a site. Build a blog. <br className="hidden md:inline" /> Build your movement.
          </h1>

          <p className="wp-hero-subtitle">
            Join millions of writers, news outlets, and creators using WordPress to publish their finest work with complete creative control and enterprise speed.
          </p>

          <form onSubmit={handleDomainSubmit} className="wp-hero-search-box">
            <div className="wp-hero-input-wrapper">
              <Globe size={18} className="wp-hero-globe-icon" />
              <input
                type="text"
                className="wp-hero-input"
                placeholder="Search blog topics, articles, or enter your site name..."
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
              />
              <button type="submit" className="btn btn-wp-primary wp-hero-submit-btn">
                <span>Get Started</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>

          {/* Quick Topic Pills */}
          <div className="wp-hero-pills">
            <span className="wp-pills-label">Popular Topics:</span>
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`wp-pill-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* WordPress Feature Cards Showcase */}
      {!selectedCategory && !urlQuery && (
        <section className="wp-features-grid">
          <div className="wp-feature-card">
            <div className="wp-feature-icon bg-blue">
              <Sparkles size={22} />
            </div>
            <h3 className="wp-feature-title">Block Editor</h3>
            <p className="wp-feature-desc">
              Compose beautiful articles with Gutenberg block layout, rich media embeds, and instant publishing.
            </p>
          </div>

          <div className="wp-feature-card">
            <div className="wp-feature-icon bg-purple">
              <Zap size={22} />
            </div>
            <h3 className="wp-feature-title">High-Speed API</h3>
            <p className="wp-feature-desc">
              Powered by Spring Boot 3 Java backend for sub-millisecond response times and real-time JWT security.
            </p>
          </div>

          <div className="wp-feature-card">
            <div className="wp-feature-icon bg-emerald">
              <ShieldCheck size={22} />
            </div>
            <h3 className="wp-feature-title">Role-Based Access</h3>
            <p className="wp-feature-desc">
              Multi-user moderation with granular roles for Admins, Authors, Editors, and Readers.
            </p>
          </div>

          <div className="wp-feature-card">
            <div className="wp-feature-icon bg-amber">
              <Newspaper size={22} />
            </div>
            <h3 className="wp-feature-title">News & Events Desk</h3>
            <p className="wp-feature-desc">
              Integrated real-time news ticker broadcast and scheduled tech event management.
            </p>
          </div>
        </section>
      )}

      {/* Editorial Navigation Tabs */}
      <nav className="wp-topic-bar">
        <div className="wp-topic-links">
          <button
            className={`wp-topic-tab ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); }}
          >
            All Stories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`wp-topic-tab ${selectedCategory === cat.slug ? 'active' : ''}`}
              onClick={() => {
                if (selectedCategory === cat.slug) {
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);
                } else {
                  setSelectedCategory(cat.slug);
                  setSelectedSubCategory(null);
                }
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sub-Category Selector */}
        {selectedCategory && availableSubCategories.length > 0 && (
          <div className="wp-subtopic-bar">
            <span className="wp-subtopic-label">Subtopic:</span>
            <button
              className={`wp-subtopic-chip ${selectedSubCategory === null ? 'active' : ''}`}
              onClick={() => setSelectedSubCategory(null)}
            >
              All {currentCategoryObj?.name}
            </button>
            {availableSubCategories.map(sub => (
              <button
                key={sub.id}
                className={`wp-subtopic-chip ${selectedSubCategory === sub.slug || selectedSubCategory === sub.name ? 'active' : ''}`}
                onClick={() => setSelectedSubCategory(selectedSubCategory === sub.name ? null : sub.name)}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Featured Story Spotlight */}
      {!selectedCategory && !urlQuery && featuredBlog && (
        <section className="wp-featured-hero-layout">
          <div className="wp-featured-main">
            <div className="wp-featured-badge">
              <span>{featuredBlog.category?.name || 'Featured Story'}</span>
              {featuredBlog.subCategoryName && <span>• {featuredBlog.subCategoryName}</span>}
            </div>
            <h2 className="wp-featured-title">
              <Link to={`/blog/${featuredBlog.slug}`}>{featuredBlog.title}</Link>
            </h2>
            <p className="wp-featured-summary">
              {featuredBlog.summary}
            </p>
            {featuredBlog.coverImageUrl && (
              <div className="wp-featured-img-container">
                <img 
                  src={featuredBlog.coverImageUrl} 
                  alt={featuredBlog.title}
                  className="wp-featured-img"
                />
              </div>
            )}
            <div className="wp-featured-footer">
              <div className="wp-author-info">
                <img 
                  src={featuredBlog.author?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'} 
                  alt={featuredBlog.author?.fullName || 'Author'} 
                  className="wp-author-avatar"
                />
                <span>By <strong>{featuredBlog.author?.fullName || featuredBlog.author?.username || 'WordPress Team'}</strong></span>
              </div>
              <Link to={`/blog/${featuredBlog.slug}`} className="btn btn-wp-primary text-xs">
                Read Full Story <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Events & Community Sidebar */}
          <aside className="wp-featured-sidebar">
            <div className="wp-widget-card">
              <h3 className="wp-widget-header">
                <Calendar size={18} className="text-wp-blue" />
                <span>Upcoming Events</span>
              </h3>
              {events.length > 0 ? (
                <div className="space-y-4">
                  {events.slice(0, 3).map(ev => (
                    <div key={ev.id} className="wp-event-item">
                      <div className="wp-event-cat">{ev.categoryName} {ev.subCategoryName ? `→ ${ev.subCategoryName}` : ''}</div>
                      <h4 className="wp-event-title">{ev.title}</h4>
                      <p className="wp-event-meta">📅 {ev.eventDate} • 📍 {ev.location}</p>
                      {ev.registrationUrl && (
                        <a href={ev.registrationUrl} target="_blank" rel="noreferrer" className="wp-event-link">
                          Register Now →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted italic">No scheduled events at this time.</p>
              )}
              <Link to="/events" className="wp-widget-footer-link">
                View All Events Calendar →
              </Link>
            </div>
          </aside>
        </section>
      )}

      {/* Main Content Feed (Gutenberg Grid/List) */}
      <section className="wp-feed-section">
        <div className="wp-feed-header">
          <div>
            <h2 className="wp-feed-title">
              {urlQuery ? `Search Results for "${urlQuery}"` :
               selectedCategory ? `${currentCategoryObj?.name || selectedCategory}${selectedSubCategory ? ` → ${selectedSubCategory}` : ''}` :
               'Latest WordPress Stories'}
            </h2>
            <p className="wp-feed-subtitle">{blogs.length} published articles</p>
          </div>

          {/* View Mode Toggle */}
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

        {loading ? (
          <div className="wp-loading-state">
            <div className="wp-spinner"></div>
            <span>Loading stories from WordPress backend...</span>
          </div>
        ) : blogs.length > 0 ? (
          <div className={viewMode === 'grid' ? 'wp-grid-layout' : 'wp-list-layout'}>
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="wp-empty-state">
            <SearchX size={44} className="wp-empty-icon" />
            <h3 className="wp-empty-title">No articles found in this topic</h3>
            <p className="wp-empty-desc">Try selecting a different topic or reset your search query.</p>
            <button className="btn btn-wp-primary mt-4" onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); }}>
              Reset View
            </button>
          </div>
        )}
      </section>

      {/* WordPress Categories Directory */}
      {!selectedCategory && !urlQuery && (
        <section className="wp-category-directory">
          <h3 className="wp-directory-header">
            Explore WordPress Content Taxonomy
          </h3>
          <div className="wp-directory-grid">
            {categories.map(cat => (
              <div key={cat.id} className="wp-directory-card">
                <div className="wp-directory-card-head">
                  <h4 className="wp-directory-card-title">{cat.name}</h4>
                  <span className="wp-directory-badge">{cat.subCategories?.length || 0} subtopics</span>
                </div>
                <p className="wp-directory-desc">{cat.description}</p>
                <div className="wp-directory-tags">
                  {(cat.subCategories || []).map(sub => (
                    <Link key={sub.id} to={`/category/${cat.slug}/${sub.slug}`} className="wp-directory-chip">
                      {sub.name}
                    </Link>
                  ))}
                </div>
                <Link to={`/category/${cat.slug}`} className="wp-directory-link">
                  Browse {cat.name} Section <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Footer Banner - WordPress.com Style */}
      {!selectedCategory && !urlQuery && (
        <section className="wp-cta-banner">
          <h2 className="wp-cta-title">Ready to publish your next masterpiece?</h2>
          <p className="wp-cta-desc">
            Start writing with the block editor, build your brand, and connect with millions of readers today.
          </p>
          <div className="wp-cta-actions">
            <Link to="/register" className="btn btn-wp-white">
              Create Your Free Blog
            </Link>
            <Link to="/login" className="btn btn-wp-outline-white">
              Log In to Studio
            </Link>
          </div>
        </section>
      )}

    </div>
  );
};

export default HomePage;
