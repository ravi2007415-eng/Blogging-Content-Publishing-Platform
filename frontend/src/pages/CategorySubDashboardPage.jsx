import React, { useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CategoryContext } from '../context/CategoryContext';
import { BlogCard } from '../components/BlogCard';
import { EventCard } from '../components/EventCard';
import { MOCK_BLOGS, MOCK_EVENTS } from '../mockData';
import { Trophy, Landmark, Cpu, Film, Smile, Calendar, Sparkles, Filter, Layers, ArrowLeft } from 'lucide-react';

export const CategorySubDashboardPage = () => {
  const { categorySlug, subCategorySlug } = useParams();
  const { categories, getCategoryBySlug } = useContext(CategoryContext);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'posts', 'events', 'trending'

  const currentCategory = getCategoryBySlug(categorySlug) || {
    name: categorySlug ? categorySlug.toUpperCase() : 'Category',
    slug: categorySlug || 'category',
    description: 'Explore the latest updates, breaking news, and upcoming events.',
    subCategories: []
  };

  const activeSubCategory = subCategorySlug 
    ? (currentCategory.subCategories || []).find(s => s.slug.toLowerCase() === subCategorySlug.toLowerCase())
    : null;

  // Filter posts matching category and sub-category
  const filteredPosts = MOCK_BLOGS.filter(blog => {
    const matchesCategory = blog.category?.slug.toLowerCase() === categorySlug?.toLowerCase() ||
                            blog.category?.name.toLowerCase() === currentCategory.name.toLowerCase();
    
    if (!matchesCategory) return false;

    if (subCategorySlug) {
      return blog.subCategoryName?.toLowerCase() === activeSubCategory?.name.toLowerCase() ||
             blog.subCategoryName?.toLowerCase() === subCategorySlug.toLowerCase();
    }
    return true;
  });

  // Filter events matching category and sub-category
  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesCategory = event.categoryName.toLowerCase() === currentCategory.name.toLowerCase() ||
                            event.categoryName.toLowerCase() === categorySlug?.toLowerCase();
    
    if (!matchesCategory) return false;

    if (subCategorySlug) {
      return event.subCategoryName.toLowerCase() === activeSubCategory?.name.toLowerCase() ||
             event.subCategoryName.toLowerCase() === subCategorySlug.toLowerCase();
    }
    return true;
  });

  return (
    <div className="page-container category-subdashboard-page">
      
      {/* Category Header Hero Banner */}
      <div className="category-hero-panel glass-panel">
        <div className="category-hero-content">
          <div className="breadcrumbs">
            <Link to="/" className="breadcrumb-item"><ArrowLeft size={14} /> Home</Link>
            <span className="breadcrumb-sep">/</span>
            <Link to={`/category/${currentCategory.slug}`} className="breadcrumb-item">{currentCategory.name}</Link>
            {activeSubCategory && (
              <>
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-active">{activeSubCategory.name}</span>
              </>
            )}
          </div>

          <div className="category-header-title-row">
            <div className="category-icon-box">
              <Trophy size={32} className="text-cyan" />
            </div>
            <div>
              <h1 className="category-hero-title">
                {activeSubCategory ? `${currentCategory.name} → ${activeSubCategory.name}` : `${currentCategory.name} Sub-Dashboard`}
              </h1>
              <p className="category-hero-desc">
                {activeSubCategory?.description || currentCategory.description}
              </p>
            </div>
          </div>

          <div className="category-stats-row">
            <div className="cat-stat-badge">
              <span className="cat-stat-num">{filteredPosts.length}</span>
              <span className="cat-stat-lbl">Articles</span>
            </div>
            <div className="cat-stat-badge">
              <span className="cat-stat-num">{filteredEvents.length}</span>
              <span className="cat-stat-lbl">Upcoming Events</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Categories Navigation Pills */}
      {currentCategory.subCategories && currentCategory.subCategories.length > 0 && (
        <div className="sub-categories-pill-bar glass-panel">
          <div className="pill-bar-header">
            <Layers size={16} className="text-pink" />
            <span>Sub-Categories:</span>
          </div>
          <div className="pill-scroll-container">
            <Link
              to={`/category/${currentCategory.slug}`}
              className={`sub-cat-pill ${!subCategorySlug ? 'active' : ''}`}
            >
              All {currentCategory.name}
            </Link>
            {currentCategory.subCategories.map(sub => (
              <Link
                key={sub.id}
                to={`/category/${currentCategory.slug}/${sub.slug}`}
                className={`sub-cat-pill ${subCategorySlug?.toLowerCase() === sub.slug.toLowerCase() ? 'active' : ''}`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Content View Tabs Filter */}
      <div className="dashboard-content-grid">
        <div className="main-content-col">
          
          <div className="section-header-bar">
            <div className="tab-filters">
              <button
                className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Content
              </button>
              <button
                className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
                onClick={() => setActiveTab('posts')}
              >
                Articles ({filteredPosts.length})
              </button>
              <button
                className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => setActiveTab('events')}
              >
                Upcoming Events ({filteredEvents.length})
              </button>
            </div>
          </div>

          {/* Render Filtered Upcoming Events if activeTab is 'events' or 'all' */}
          {(activeTab === 'all' || activeTab === 'events') && filteredEvents.length > 0 && (
            <div className="subdashboard-events-section mb-8">
              <div className="subsection-title-bar">
                <Calendar size={18} className="text-pink" />
                <h3>Category Upcoming Events</h3>
              </div>
              <div className="events-grid">
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}

          {/* Render Filtered Posts if activeTab is 'posts' or 'all' */}
          {(activeTab === 'all' || activeTab === 'posts') && (
            <div className="subdashboard-posts-section">
              <div className="subsection-title-bar">
                <Sparkles size={18} className="text-cyan" />
                <h3>Latest {activeSubCategory ? activeSubCategory.name : currentCategory.name} Updates</h3>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="empty-state-panel glass-panel text-center py-12">
                  <p className="text-muted">No published stories in this sub-category yet.</p>
                  <Link to="/write" className="btn btn-primary mt-4">
                    Publish First Story
                  </Link>
                </div>
              ) : (
                <div className="blogs-grid">
                  {filteredPosts.map(blog => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Sidebar Widgets */}
        <div className="sidebar-col">
          
          {/* Quick Sub-Category Summary Widget */}
          <div className="sidebar-widget glass-panel">
            <h4 className="widget-title">About {activeSubCategory ? activeSubCategory.name : currentCategory.name}</h4>
            <p className="widget-desc text-muted">
              {activeSubCategory?.description || currentCategory.description}
            </p>
            <hr className="my-3 border-glass" />
            <div className="widget-action">
              <Link to="/write" className="btn btn-outline btn-sm w-full text-center">
                Publish in {activeSubCategory ? activeSubCategory.name : currentCategory.name}
              </Link>
            </div>
          </div>

          {/* Upcoming Events Mini Widget */}
          {filteredEvents.length > 0 && activeTab !== 'events' && (
            <div className="sidebar-widget glass-panel">
              <div className="widget-header">
                <Calendar size={16} className="text-pink" />
                <h4 className="widget-title">Upcoming Event Spotlight</h4>
              </div>
              <div className="spotlight-event-box">
                <h5 className="font-bold text-sm mb-1">{filteredEvents[0].title}</h5>
                <p className="text-xs text-muted mb-2">{filteredEvents[0].eventDate} • {filteredEvents[0].location}</p>
                <a
                  href={filteredEvents[0].registrationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-primary w-full text-center"
                >
                  Register Now
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CategorySubDashboardPage;
