import React, { useState, useContext, useRef } from 'react';
import { MOCK_BLOGS, MOCK_EVENTS } from '../mockData';
import { CategoryContext } from '../context/CategoryContext';
import { BlogCard } from '../components/BlogCard';
import { LiveTicker } from '../components/LiveTicker';
import { 
  Sparkles, TrendingUp, Filter, SearchX, Calendar,
  Flame, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, Layers,
  Compass, BookOpen, Clock, User
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

const TRENDING_SEARCHES = [
  'Artificial Intelligence',
  'React.js',
  'Python',
  'Java',
  'Cloud Computing',
  'Cybersecurity',
  'Web Development',
  'Career & Jobs'
];

export const HomePage = ({ searchQuery }) => {
  const { categories } = useContext(CategoryContext);
  const [blogs] = useState(MOCK_BLOGS);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const carouselRef = useRef(null);
  
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
        blog.category?.name.toLowerCase().includes(urlQuery.toLowerCase()) ||
        blog.author?.name.toLowerCase().includes(urlQuery.toLowerCase()) ||
        (blog.tags && blog.tags.some(t => t.name.toLowerCase().includes(urlQuery.toLowerCase())))
      : true;

    return matchesCategory && matchesSubCategory && matchesSearch;
  });

  const featuredBlog = blogs.find(b => b.isFeatured) || blogs[0];
  const recommendedBlogs = blogs.filter(b => b.id !== featuredBlog.id).slice(0, 4);
  const trendingBlogs = blogs.filter(b => b.isTrending);

  // Carousel navigation handlers
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleTrendingClick = (term) => {
    setSearchParams({ q: term });
  };

  return (
    <div className="home-page-container space-y-10">
      
      {/* Live Breaking Updates Ticker */}
      <LiveTicker />

      {/* Modern Editorial Hero Section */}
      {!selectedCategory && !urlQuery && (
        <section className="editorial-hero-section">
          <div className="geo-decor geo-circle-lg" />
          <div className="geo-decor geo-arc-purple" />
          <div className="geo-decor geo-dots-grid" />
          <div className="geo-decor geo-diagonal-stripes" />

          <div className="editorial-hero-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Typography & Text */}
            <div className="lg:col-span-7 hero-text-area animate-fade-in-left">
              <div className="editorial-hero-badge">
                <span className="geo-bullet" />
                <span>KERYX DIGITAL PUBLISHING</span>
              </div>
              <h1 className="hero-editorial-title">
                Publish your stories, <span className="text-highlight-yellow">insights</span> & ideas boldly.
              </h1>
              <p className="hero-editorial-subtitle">
                The modern digital publication platform for developers, creators, thinkers, and researchers across technology, AI, programming, science, business, and lifestyle.
              </p>
              <div className="hero-cta-group">
                <Link to="/write" className="btn-hero-cta btn-hero-primary">
                  Start Writing
                </Link>
                <Link to="/explore" className="btn-hero-cta btn-hero-secondary">
                  Explore Channels
                </Link>
              </div>
            </div>

            {/* Right Column: Platform Metrics & Channel Highlights */}
            <div className="lg:col-span-5 hero-graphic-area animate-fade-in-right">
              <div className="editorial-artwork-frame">
                <div className="artwork-grid">
                  <div className="artwork-cell cell-blue">
                    <span className="artwork-tag">01 / AI & ML</span>
                    <h4>Autonomous Coding Agents</h4>
                  </div>
                  <div className="artwork-cell cell-yellow">
                    <span className="artwork-tag">02 / CLOUD</span>
                    <h4>Distributed Systems</h4>
                  </div>
                  <div className="artwork-cell cell-purple">
                    <span className="artwork-tag">03 / WEB DEV</span>
                    <h4>Modern React 19 Patterns</h4>
                  </div>
                  <div className="artwork-cell cell-orange">
                    <span className="artwork-tag">04 / BUSINESS</span>
                    <h4>Future of SaaS & Tech</h4>
                  </div>
                </div>

                <div className="hero-floating-badge badge-readers animate-float-slow">
                  <span className="badge-icon">👥</span>
                  <div className="badge-details">
                    <span className="badge-lbl">Active Readers</span>
                    <span className="badge-val">15.4k online</span>
                  </div>
                </div>

                <div className="hero-floating-badge badge-posts animate-float-mid">
                  <span className="badge-icon">📝</span>
                  <div className="badge-details">
                    <span className="badge-lbl">Articles Published</span>
                    <span className="badge-val">3,420 articles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trending Searches Row */}
      <section className="trending-searches-section glass-panel p-4 flex flex-wrap items-center gap-3">
        <div className="trending-label flex items-center gap-2 text-sm font-bold text-cyan">
          <TrendingUp size={16} />
          <span>Trending Searches:</span>
        </div>
        <div className="trending-chips-wrap flex flex-wrap gap-2">
          {TRENDING_SEARCHES.map((term, index) => (
            <button
              key={index}
              onClick={() => handleTrendingClick(term)}
              className="trending-chip-btn"
            >
              #{term}
            </button>
          ))}
        </div>
      </section>

      {/* Controlled Horizontal Carousel with Left/Right Buttons */}
      {!selectedCategory && !urlQuery && blogs.length > 0 && (
        <section className="controlled-carousel-section">
          <div className="carousel-header-row flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-cyan animate-pulse" />
              <h3 className="text-lg font-bold text-gradient">Editorial Spotlight Carousel</h3>
            </div>
            <div className="carousel-nav-buttons flex items-center gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="carousel-nav-btn"
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="carousel-nav-btn"
                aria-label="Scroll right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="carousel-scroll-container flex gap-4 overflow-x-auto scroll-smooth no-scrollbar py-2"
          >
            {blogs.map((blog) => (
              <Link
                to={`/blog/${blog.slug || blog.id}`}
                key={`carousel-card-${blog.id}`}
                className="carousel-item-card glass-panel flex-shrink-0"
              >
                <div className="carousel-card-img-wrap relative">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="carousel-card-img"
                  />
                  {blog.category && (
                    <span className="carousel-card-badge">
                      {blog.category.name}
                    </span>
                  )}
                </div>
                <div className="carousel-card-body p-4">
                  <h4 className="carousel-card-title line-clamp-2">{blog.title}</h4>
                  <p className="carousel-card-summary line-clamp-2 text-xs text-muted mt-1">{blog.summary}</p>
                  <div className="carousel-card-meta flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
                    <img
                      src={blog.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={blog.author?.name || 'Author'}
                      className="carousel-author-avatar"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-white/90">{blog.author?.name}</p>
                      <span className="text-muted">{blog.readTime || '5 min read'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Story & Upcoming Events Dual Spotlight */}
      {!selectedCategory && !urlQuery && (
        <section className="featured-spotlight-section grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Featured Hero Story Card */}
          <div className="lg:col-span-8 featured-hero-card glass-panel relative overflow-hidden rounded-2xl flex flex-col justify-end min-h-[420px] p-6 lg:p-8">
            <div 
              className="featured-bg-img absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105" 
              style={{ backgroundImage: `url(${featuredBlog.coverImage})` }}
            />
            <div className="featured-overlay absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />
            
            <div className="featured-content relative z-10 space-y-3">
              <div className="featured-badges flex flex-wrap gap-2">
                <span className="badge badge-pink">★ FEATURED STORY</span>
                <span className="badge badge-cyan">{featuredBlog.category?.name} → {featuredBlog.subCategoryName}</span>
              </div>
              
              <h2 className="featured-title text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                {featuredBlog.title}
              </h2>
              
              <p className="featured-summary text-sm lg:text-base text-gray-200 line-clamp-3">
                {featuredBlog.summary}
              </p>
              
              <div className="featured-footer flex flex-wrap justify-between items-center pt-4 border-t border-white/20 gap-4">
                <div className="author-info flex items-center gap-3">
                  <img
                    src={featuredBlog.author?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                    alt={featuredBlog.author?.name}
                    className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-white">{featuredBlog.author?.name}</p>
                    <p className="text-xs text-gray-300">
                      {new Date(featuredBlog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {featuredBlog.readTime}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/blog/${featuredBlog.slug}`}
                  className="btn btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/30"
                >
                  <span>Read Full Story</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Upcoming Events Spotlight Widget */}
          <div className="lg:col-span-4 upcoming-events-widget glass-panel p-6 flex flex-col justify-between rounded-2xl">
            <div>
              <div className="widget-title-row flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Calendar size={18} className="text-pink animate-pulse" />
                  <span>Upcoming Events</span>
                </h3>
                <Link to="/events" className="text-xs text-cyan hover:underline font-semibold">View All</Link>
              </div>

              <div className="space-y-4">
                {MOCK_EVENTS.slice(0, 3).map(ev => (
                  <div key={ev.id} className="mini-event-card glass-panel p-3.5 rounded-xl transition hover:border-cyan-400/40">
                    <span className="badge badge-outline text-[11px] mb-1.5">{ev.categoryName}</span>
                    <h4 className="font-bold text-sm text-gradient leading-snug mb-1 line-clamp-1">{ev.title}</h4>
                    <p className="text-xs text-muted mb-2">📅 {ev.eventDate} • 📍 {ev.location}</p>
                    <Link
                      to="/events"
                      className="btn btn-xs btn-outline w-full text-center text-xs block py-1"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <Link to="/events" className="btn btn-secondary btn-sm w-full text-center mt-4">
              Explore All Scheduled Events
            </Link>
          </div>

        </section>
      )}

      {/* Recommended For You Section (Requirement 8) */}
      {!selectedCategory && !urlQuery && recommendedBlogs.length > 0 && (
        <section className="recommended-section space-y-4">
          <div className="section-title-row flex justify-between items-center">
            <h3 className="section-title flex items-center gap-2 text-xl font-bold">
              <Compass size={22} className="text-cyan" />
              <span>Recommended for You</span>
            </h3>
            <span className="text-xs text-muted">Curated topics & popular reads</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedBlogs.map(blog => (
              <BlogCard key={`recommended-${blog.id}`} blog={blog} />
            ))}
          </div>
        </section>
      )}

      {/* Main Feed Section (Category-wise / Search Results) */}
      <section id="feed" className="feed-section space-y-6">
        <div className="feed-header flex flex-wrap justify-between items-center gap-4">
          <div className="feed-title-wrap flex items-center gap-2">
            <TrendingUp className="accent-icon text-cyan" size={24} />
            <h2 className="text-2xl font-bold">
              {urlQuery ? `Search Results for "${urlQuery}"` : 
               selectedCategory ? `${currentCategoryObj?.name}${selectedSubCategory ? ` → ${selectedSubCategory}` : ''} Feed` : 
               'Latest Publishing Feed'}
            </h2>
          </div>
          
          {/* Quick Category Filter Pills */}
          <div className="quick-category-pills flex flex-wrap gap-2">
            <button
              onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); }}
              className={`pill-btn text-xs ${!selectedCategory ? 'active' : ''}`}
            >
              All Topics
            </button>
            {categories.slice(0, 6).map(c => (
              <button
                key={`cat-pill-${c.id}`}
                onClick={() => { setSelectedCategory(c.slug); setSelectedSubCategory(null); }}
                className={`pill-btn text-xs ${selectedCategory === c.slug ? 'active' : ''}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {filteredBlogs.length > 0 ? (
          <div className="blogs-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="empty-state glass-panel text-center py-16 rounded-2xl">
            <SearchX size={48} className="empty-icon mx-auto text-muted mb-3" />
            <h3 className="text-lg font-bold">No articles found matching your query</h3>
            <p className="text-muted text-sm mt-1">Try adjusting your search keywords or topic filter.</p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); setSearchParams({}); }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* Category Explorer Channels Grid (Requirement 10) */}
      {!selectedCategory && !urlQuery && (
        <section className="category-explorer-section space-y-6">
          <div className="section-title-row flex justify-between items-center">
            <h3 className="section-title flex items-center gap-2 text-xl font-bold">
              <Layers size={22} className="text-cyan" />
              <span>Explore Content Channels & Topics</span>
            </h3>
            <Link to="/explore" className="text-xs text-cyan hover:underline font-semibold">Browse All Channels</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.slice(0, 9).map(cat => (
              <div key={cat.id} className="category-card-hub glass-panel p-5 rounded-2xl flex flex-col justify-between transition hover:border-cyan-400/40">
                <div>
                  <div className="cat-card-header flex justify-between items-center mb-2.5">
                    <h4 className="font-bold text-lg text-gradient">{cat.name}</h4>
                    <span className="badge badge-outline text-[11px]">{cat.subCategories?.length || 0} Subtopics</span>
                  </div>
                  <p className="text-xs text-muted mb-4 line-clamp-2">{cat.description}</p>
                </div>
                
                <Link
                  to={`/category/${cat.slug}`}
                  className="btn btn-sm btn-outline w-full text-center flex justify-center items-center gap-1 text-xs"
                >
                  <span>Explore {cat.name}</span>
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
