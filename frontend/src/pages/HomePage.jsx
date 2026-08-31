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
  const getCategoryColorClass = (slug) => {
    switch (slug?.toLowerCase()) {
      case 'technology':
      case 'software':
        return 'theme-blue';
      case 'ai-ml':
      case 'artificial-intelligence':
      case 'ai':
        return 'theme-purple';
      case 'cloud':
      case 'devops-cloud':
        return 'theme-cyan';
      case 'programming':
      case 'software-engineering':
        return 'theme-yellow';
      case 'business':
      case 'career':
      case 'startups':
        return 'theme-orange';
      case 'education':
      case 'sports':
        return 'theme-red';
      default:
        return 'theme-indigo';
    }
  };

  return (
    <div className="home-page-container space-y-8">
      
      {/* Live Breaking Updates Ticker */}
      <LiveTicker />

      {/* Colorful Editorial Hero Section */}
      {!selectedCategory && !urlQuery && (
        <section className="editorial-hero-section">
          {/* Subtle Decorative Geometric Background Elements */}
          <div className="geo-decor geo-circle-lg"></div>
          <div className="geo-decor geo-arc-purple"></div>
          <div className="geo-decor geo-dots-grid"></div>
          <div className="geo-decor geo-diagonal-stripes"></div>

          <div className="editorial-hero-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Typography & Text */}
            <div className="lg:col-span-6 hero-text-area animate-fade-in-left">
              <div className="editorial-hero-badge">
                <span className="geo-bullet"></span>
                <span>SPORTS NEWS CENTRAL</span>
              </div>
              <h1 className="hero-editorial-title">
                Publish your <span className="text-highlight-yellow">sports</span> stories boldly.
              </h1>
              <p className="hero-editorial-subtitle">
                Follow live scores, read expert tactical breakdowns, and get breaking updates from the world of athletics, motorsport, cricket, football, and more.
              </p>
              <div className="hero-cta-group">
                <Link to="/register" className="btn-hero-cta btn-hero-primary">
                  Start Writing
                </Link>
                <Link to="/explore" className="btn-hero-cta btn-hero-secondary">
                  Explore Stories
                </Link>
              </div>
            </div>

            {/* Right Column: Original Blogging Illustration composition */}
            <div className="lg:col-span-6 hero-graphic-area animate-fade-in-right">
              <div className="editorial-artwork-frame">
                {/* Geometric Abstract Editorial Grid */}
                <div className="artwork-grid">
                  <div className="artwork-cell cell-blue">
                    <span className="artwork-tag">01 / CRICKET</span>
                    <h4>Next Big Cricket Series</h4>
                  </div>
                  <div className="artwork-cell cell-yellow">
                    <span className="artwork-circle"></span>
                    <span className="artwork-wave">~~~~</span>
                  </div>
                  <div className="artwork-cell cell-purple">
                    <span className="artwork-tag">02 / F1</span>
                    <h4>Monaco GP qualifying highlights</h4>
                  </div>
                  <div className="artwork-cell cell-orange">
                    <span className="artwork-tag">03 / FOOTBALL</span>
                    <h4>Derby night tactics</h4>
                  </div>
                </div>

                {/* Overlapping Floating Cards */}
                <div className="hero-floating-badge badge-readers animate-float-slow">
                  <span className="badge-icon">👥</span>
                  <div className="badge-details">
                    <span className="badge-lbl">Active Readers</span>
                    <span className="badge-val">4.8k online</span>
                  </div>
                </div>

                <div className="hero-floating-badge badge-posts animate-float-mid">
                  <span className="badge-icon">📝</span>
                  <div className="badge-details">
                    <span className="badge-lbl">Articles Published</span>
                    <span className="badge-val">1,240 articles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Horizontal Scrolling Editorial Ticker (Replaces Hero Section) */}
      {!selectedCategory && !urlQuery && blogs.length > 0 && (() => {
        // Ensure at least 6 items for smooth scrolling without gaps
        let tickerBlogs = [...blogs];
        while (tickerBlogs.length < 6) {
          tickerBlogs = [...tickerBlogs, ...blogs];
        }
        return (
          <section className="full-width-ticker-section">
            <div className="ticker-section-header">
              <div className="ticker-title-row">
                <div className="pulse-dot" />
                <span className="ticker-label">Editorial Stream</span>
              </div>
            </div>
            <div className="marquee-wrapper">
              <div className="marquee-track">
                {/* First set of cards */}
                <div className="marquee-content">
                  {tickerBlogs.map((blog, index) => (
                    <Link
                      to={`/blog/${blog.slug || blog.id}`}
                      key={`marquee-1-${blog.id}-${index}`}
                      className={`editorial-marquee-card width-${index % 3}`}
                    >
                      <div className="editorial-card-img-wrapper">
                        {blog.coverImage && (
                          <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="editorial-card-img"
                          />
                        )}
                        {blog.category && (
                          <span className="editorial-card-category">
                            {blog.category.name}
                          </span>
                        )}
                      </div>
                      <div className="editorial-card-body">
                        <h4 className="editorial-card-title">{blog.title}</h4>
                        <div className="editorial-card-meta">
                          <img
                            src={blog.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                            alt={blog.author?.name || 'Author'}
                            className="editorial-card-avatar"
                          />
                          <div className="editorial-card-meta-text">
                            <span className="editorial-card-author">
                              {blog.author?.name || 'Anonymous'}
                            </span>
                            <span className="editorial-card-date-time">
                              {blog.readTime || '3 min read'} • {new Date(blog.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {/* Duplicate set for seamless looping */}
                <div className="marquee-content">
                  {tickerBlogs.map((blog, index) => (
                    <Link
                      to={`/blog/${blog.slug || blog.id}`}
                      key={`marquee-2-${blog.id}-${index}`}
                      className={`editorial-marquee-card width-${index % 3}`}
                    >
                      <div className="editorial-card-img-wrapper">
                        {blog.coverImage && (
                          <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="editorial-card-img"
                          />
                        )}
                        {blog.category && (
                          <span className="editorial-card-category">
                            {blog.category.name}
                          </span>
                        )}
                      </div>
                      <div className="editorial-card-body">
                        <h4 className="editorial-card-title">{blog.title}</h4>
                        <div className="editorial-card-meta">
                          <img
                            src={blog.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                            alt={blog.author?.name || 'Author'}
                            className="editorial-card-avatar"
                          />
                          <div className="editorial-card-meta-text">
                            <span className="editorial-card-author">
                              {blog.author?.name || 'Anonymous'}
                            </span>
                            <span className="editorial-card-date-time">
                              {blog.readTime || '3 min read'} • {new Date(blog.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })()}


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
                    <Link
                      to={ev.registrationUrl}
                      className="btn btn-xs btn-primary w-full text-center"
                    >
                      Read More
                    </Link>
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
              <span>Trending Across Sports Channels</span>
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
               'Latest Sports Headlines'}
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
              <span>Explore Sports Sub-Category Hubs</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {((categories.find(c => c.slug === 'sports') || categories[0])?.subCategories || []).map(sub => {
              const getDescription = (name) => {
                switch (name.toLowerCase()) {
                  case 'cricket':
                    return 'Live scores, tournaments, team news and player updates.';
                  case 'volleyball':
                    return 'Tournament updates, team news, match schedules and player highlights.';
                  case 'football':
                    return 'League news, match updates, transfers and player performances.';
                  case 'basketball':
                    return 'League updates, fixtures, scores and player news.';
                  case 'tennis':
                    return 'Tournament updates, rankings, match results and player news.';
                  case 'badminton':
                    return 'Tournament news, rankings and player performances.';
                  case 'athletics':
                    return 'Competition updates, records and athlete highlights.';
                  case 'formula 1':
                  case 'formula-1':
                    return 'Race weekends, qualifying, results and driver updates.';
                  case 'motorsport':
                    return 'MotoGP, Le Mans, rally racing, and endurance championships.';
                  default:
                    return 'Latest news, team updates, match analysis and highlights.';
                }
              };
              
              const colorClass = getCategoryColorClass(sub.slug);
              
              return (
                <div key={sub.id} className={`category-card-hub glass-panel p-5 hover:border-pink-500/40 transition ${colorClass}`}>
                  <div className="cat-card-header flex justify-between items-center mb-3">
                    <h4 className="font-bold text-lg text-gradient">{sub.name}</h4>
                    <span className="badge badge-outline text-xs">Sports</span>
                  </div>
                  <p className="text-xs text-muted mb-4 line-clamp-2">{getDescription(sub.name)}</p>
                  
                  <Link to={`/category/sports/${sub.slug}`} className="btn btn-sm btn-outline w-full text-center flex justify-center items-center gap-1">
                    <span>Open {sub.name} Hub</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
};

export default HomePage;
