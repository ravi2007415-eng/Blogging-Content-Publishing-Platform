import React, { useState, useContext } from 'react';
import { MOCK_BLOGS, MOCK_EVENTS } from '../mockData';
import { CategoryContext } from '../context/CategoryContext';
import { BlogCard } from '../components/BlogCard';
import { EventCard } from '../components/EventCard';
import { LiveTicker } from '../components/LiveTicker';
import { 
  Sparkles, TrendingUp, Filter, SearchX, Calendar, Trophy, Zap, 
  Flame, Radio, ArrowRight, Layers 
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

export const HomePage = ({ searchQuery }) => {
  const { categories } = useContext(CategoryContext);
  const [blogs] = useState(MOCK_BLOGS);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [searchParams] = useSearchParams();
  
  const urlQuery = searchParams.get('q') || searchQuery || '';

  // Get selected category object if any
  const currentCategoryObj = categories.find(c => c.slug === selectedCategory);
  const availableSubCategories = currentCategoryObj ? (currentCategoryObj.subCategories || []) : [];

  // Filter blogs based on search, main category, and sub-category
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory = selectedCategory
      ? blog.category?.slug.toLowerCase() === selectedCategory.toLowerCase() ||
        blog.category?.name.toLowerCase() === currentCategoryObj?.name.toLowerCase()
      : true;

    const matchesSubCategory = selectedSubCategory
      ? blog.subCategoryName?.toLowerCase() === selectedSubCategory.toLowerCase()
      : true;

    const matchesSearch = urlQuery.trim()
      ? blog.title.toLowerCase().includes(urlQuery.toLowerCase()) ||
        blog.summary.toLowerCase().includes(urlQuery.toLowerCase()) ||
        blog.subCategoryName?.toLowerCase().includes(urlQuery.toLowerCase()) ||
        blog.category?.name.toLowerCase().includes(urlQuery.toLowerCase())
      : true;

    return matchesCategory && matchesSubCategory && matchesSearch;
  });

  const featuredBlog = blogs.find(b => b.isFeatured) || blogs[0];
  const trendingBlogs = blogs.filter(b => b.isTrending);
  const sportsBlogs = blogs.filter(b => b.category?.name?.toLowerCase() === 'sports');

  return (
    <div className="home-page-container space-y-8">
      
      {/* Live Breaking Updates Ticker */}
      <LiveTicker />

      {/* Hero Spotlight Section */}
      <section className="hero-section glass-panel">
        <div className="hero-badge badge badge-cyan">
          <Sparkles size={14} />
          <span>Keryx Central Content Discovery</span>
        </div>
        <h1 className="hero-title">
          Real-Time Updates Across <span className="gradient-text">Sports, Tech, Events & World</span>
        </h1>
        <p className="hero-subtitle">
          Your unified intelligence dashboard. Stream breaking news, upcoming volleyball tournaments, AI benchmarks, political developments, and entertainment releases live.
        </p>

        {/* Dynamic Category Pill Filters */}
        <div className="category-pills-row">
          <button
            className={`pill-btn ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory(null);
              setSelectedSubCategory(null);
            }}
          >
            All Updates
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`pill-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
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

        {/* Sub-Category Pills Bar if a Main Category is Selected */}
        {selectedCategory && availableSubCategories.length > 0 && (
          <div className="sub-pills-subbar">
            <span className="sub-pills-label">Sub-Categories:</span>
            <button
              className={`pill-btn pill-btn-sm ${selectedSubCategory === null ? 'active' : ''}`}
              onClick={() => setSelectedSubCategory(null)}
            >
              All {currentCategoryObj.name}
            </button>
            {availableSubCategories.map(sub => (
              <button
                key={sub.id}
                className={`pill-btn pill-btn-sm ${selectedSubCategory === sub.name.toLowerCase() ? 'active' : ''}`}
                onClick={() => setSelectedSubCategory(selectedSubCategory === sub.name.toLowerCase() ? null : sub.name.toLowerCase())}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Featured Story & Upcoming Events Dual Spotlight */}
      {!selectedCategory && !urlQuery && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Featured Hero Story Card */}
          <div className="lg:col-span-2 featured-hero-card glass-panel relative overflow-hidden">
            <div 
              className="featured-bg-img" 
              style={{ backgroundImage: `url(${featuredBlog.coverImage})` }}
            />
            <div className="featured-overlay" />
            <div className="featured-content">
              <div className="featured-badges flex gap-2 mb-3">
                <span className="badge badge-pink">FEATURED STORY</span>
                <span className="badge badge-cyan">{featuredBlog.category?.name} → {featuredBlog.subCategoryName}</span>
              </div>
              <h2 className="featured-title">{featuredBlog.title}</h2>
              <p className="featured-summary">{featuredBlog.summary}</p>
              <div className="featured-footer flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                <span className="text-xs text-white/80">By {featuredBlog.author?.name} • {featuredBlog.readTime}</span>
                <Link to={`/blog/${featuredBlog.slug}`} className="btn btn-primary flex items-center gap-1 text-sm">
                  <span>Read Full Update</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Upcoming Events Spotlight Widget */}
          <div className="upcoming-events-widget glass-panel p-5 flex flex-col justify-between">
            <div>
              <div className="widget-title-row flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Calendar size={18} className="text-pink animate-pulse" />
                  <span>Upcoming Events Spotlight</span>
                </h3>
                <Link to="/events" className="text-xs text-cyan hover:underline">View Hub</Link>
              </div>

              <div className="space-y-4">
                {MOCK_EVENTS.slice(0, 2).map(ev => (
                  <div key={ev.id} className="mini-event-card glass-panel p-3">
                    <span className="badge badge-outline text-xs mb-1">{ev.categoryName} → {ev.subCategoryName}</span>
                    <h4 className="font-bold text-sm text-gradient leading-tight mb-1">{ev.title}</h4>
                    <p className="text-xs text-muted mb-2">📅 {ev.eventDate} • 📍 {ev.location}</p>
                    <a
                      href={ev.registrationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-xs btn-primary w-full text-center"
                    >
                      Register Now
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <Link to="/events" className="btn btn-outline btn-sm w-full text-center mt-4">
              Explore All Upcoming Events
            </Link>
          </div>

        </section>
      )}

      {/* Trending Content Bar */}
      {!selectedCategory && !urlQuery && trendingBlogs.length > 0 && (
        <section className="trending-section">
          <div className="section-title-row mb-4">
            <h3 className="section-title flex items-center gap-2">
              <Flame size={20} className="text-pink" />
              <span>Trending Across Categories</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingBlogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </section>
      )}

      {/* Main Feed Section (Category-wise / Search Results) */}
      <section className="feed-section">
        <div className="feed-header mb-6 flex justify-between items-center">
          <div className="feed-title-wrap flex items-center gap-2">
            <TrendingUp className="accent-icon text-cyan" size={22} />
            <h2>
              {urlQuery ? `Search Results for "${urlQuery}"` : 
               selectedCategory ? `${currentCategoryObj?.name}${selectedSubCategory ? ` → ${selectedSubCategory}` : ''} Updates` : 
               'Latest Platform Updates'}
            </h2>
          </div>
          <span className="badge badge-cyan">{filteredBlogs.length} Articles</span>
        </div>

        {filteredBlogs.length > 0 ? (
          <div className="blogs-grid">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="empty-state glass-card text-center py-16">
            <SearchX size={48} className="empty-icon mx-auto text-muted mb-3" />
            <h3>No matching updates found</h3>
            <p className="text-muted text-sm mt-1">Try adjusting your search criteria or category filter.</p>
            <button className="btn btn-secondary mt-4" onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); }}>
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Category Explorer Cards Grid */}
      {!selectedCategory && !urlQuery && (
        <section className="category-explorer-section">
          <div className="section-title-row mb-6">
            <h3 className="section-title flex items-center gap-2">
              <Layers size={20} className="text-cyan" />
              <span>Explore Central Category Sub-Dashboards</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => (
              <div key={cat.id} className="category-card-hub glass-panel p-5 hover:border-pink-500/40 transition">
                <div className="cat-card-header flex justify-between items-center mb-3">
                  <h4 className="font-bold text-lg text-gradient">{cat.name}</h4>
                  <span className="badge badge-outline text-xs">{cat.subCategories?.length || 0} Sub-categories</span>
                </div>
                <p className="text-xs text-muted mb-4 line-clamp-2">{cat.description}</p>
                
                {/* Sub-categories List preview */}
                <div className="sub-tags-preview flex flex-wrap gap-1 mb-4">
                  {(cat.subCategories || []).slice(0, 4).map(sub => (
                    <Link
                      key={sub.id}
                      to={`/category/${cat.slug}/${sub.slug}`}
                      className="sub-chip text-xs hover:text-cyan"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>

                <Link to={`/category/${cat.slug}`} className="btn btn-sm btn-outline w-full text-center flex justify-center items-center gap-1">
                  <span>Open {cat.name} Sub-Dashboard</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default HomePage;
