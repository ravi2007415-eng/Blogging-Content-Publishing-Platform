import React, { useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CategoryContext } from '../context/CategoryContext';
import { BlogCard } from '../components/BlogCard';
import { EventCard } from '../components/EventCard';
import { MOCK_BLOGS, MOCK_EVENTS } from '../mockData';
import { Trophy, ArrowLeft, Layers, Sparkles } from 'lucide-react';

export const CategorySubDashboardPage = () => {
  const { categorySlug, subCategorySlug } = useParams();
  const { categories, getCategoryBySlug } = useContext(CategoryContext);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'posts', 'events'

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
    <div className="page-container category-subdashboard-page space-y-6">
      
      {/* Category Header Hero Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link to="/" className="hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft size={13} /> Home
            </Link>
            <span>/</span>
            <Link to={`/category/${currentCategory.slug}`} className="hover:text-blue-600">
              {currentCategory.name}
            </Link>
            {activeSubCategory && (
              <>
                <span>/</span>
                <span className="text-blue-600 font-semibold">{activeSubCategory.name}</span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-2">
                {activeSubCategory ? `${currentCategory.name} → ${activeSubCategory.name}` : `${currentCategory.name} Sub-Dashboard`}
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                {activeSubCategory?.description || currentCategory.description}
              </p>
            </div>

            <div className="flex gap-3">
              <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl text-center">
                <span className="block text-lg font-extrabold text-blue-600">{filteredPosts.length}</span>
                <span className="text-xs text-slate-500 uppercase font-semibold">Articles</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-center">
                <span className="block text-lg font-extrabold text-slate-800">{filteredEvents.length}</span>
                <span className="text-xs text-slate-500 uppercase font-semibold">Events</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Categories Navigation Pills */}
      {currentCategory.subCategories && currentCategory.subCategories.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase shrink-0">
            <Layers size={15} className="text-blue-600" />
            <span>Sub-Categories:</span>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              to={`/category/${currentCategory.slug}`}
              className={`pill-btn text-xs ${!subCategorySlug ? 'active' : ''}`}
            >
              All {currentCategory.name}
            </Link>
            {currentCategory.subCategories.map(sub => (
              <Link
                key={sub.id}
                to={`/category/${currentCategory.slug}/${sub.slug}`}
                className={`pill-btn text-xs ${subCategorySlug?.toLowerCase() === sub.slug.toLowerCase() ? 'active' : ''}`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Content View Tabs Filter */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <div className="quick-category-pills">
            <button
              className={`pill-btn text-xs ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Content ({filteredPosts.length + filteredEvents.length})
            </button>
            <button
              className={`pill-btn text-xs ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              Articles ({filteredPosts.length})
            </button>
            <button
              className={`pill-btn text-xs ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              Events ({filteredEvents.length})
            </button>
          </div>
        </div>

        {/* Tab 1: All Content */}
        {activeTab === 'all' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-blue-600" />
                <span>Featured Articles</span>
              </h3>
              {filteredPosts.length > 0 ? (
                <div className="blogs-grid">
                  {filteredPosts.map(blog => (
                    <BlogCard key={`sub-post-${blog.id}`} blog={blog} />
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-sm">
                  No articles published under this category yet.
                </div>
              )}
            </div>

            {filteredEvents.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Upcoming Category Events</h3>
                <div className="events-grid">
                  {filteredEvents.map(ev => (
                    <EventCard key={`sub-ev-${ev.id}`} event={ev} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Articles Only */}
        {activeTab === 'posts' && (
          <div className="blogs-grid">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(blog => (
                <BlogCard key={`posts-only-${blog.id}`} blog={blog} />
              ))
            ) : (
              <div className="col-span-full bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-sm">
                No articles found.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Events Only */}
        {activeTab === 'events' && (
          <div className="events-grid">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(ev => (
                <EventCard key={`events-only-${ev.id}`} event={ev} />
              ))
            ) : (
              <div className="col-span-full bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-sm">
                No scheduled events found for this category.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CategorySubDashboardPage;
