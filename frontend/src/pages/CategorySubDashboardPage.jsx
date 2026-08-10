import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CategoryContext } from '../context/CategoryContext';
import { blogApi } from '../api/blogApi';
import { eventApi } from '../api/eventApi';
import { BlogCard } from '../components/BlogCard';
import { EventCard } from '../components/EventCard';
import { Trophy, Calendar, Sparkles, Layers, ArrowLeft } from 'lucide-react';

export const CategorySubDashboardPage = () => {
  const { categorySlug, subCategorySlug } = useParams();
  const { categories, getCategoryBySlug } = useContext(CategoryContext);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'posts', 'events'
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentCategory = getCategoryBySlug(categorySlug) || {
    name: categorySlug ? categorySlug.toUpperCase() : 'Category',
    slug: categorySlug || 'category',
    description: 'Explore the latest published stories and events in this section.',
    subCategories: []
  };

  const activeSubCategory = subCategorySlug 
    ? (currentCategory.subCategories || []).find(s => String(s.slug).toLowerCase() === subCategorySlug.toLowerCase() || String(s.name).toLowerCase() === subCategorySlug.toLowerCase())
    : null;

  useEffect(() => {
    const fetchCategoryContent = async () => {
      setLoading(true);
      try {
        let blogData = [];
        if (categorySlug && subCategorySlug) {
          blogData = await blogApi.getBlogsByCategoryAndSubCategory(categorySlug, subCategorySlug);
        } else if (categorySlug) {
          const res = await blogApi.filterByCategory(categorySlug);
          blogData = res.content || res;
        } else {
          const res = await blogApi.getBlogs();
          blogData = res.content || res;
        }
        setPosts(Array.isArray(blogData) ? blogData : []);

        const eventData = await eventApi.getEvents(categorySlug, subCategorySlug);
        setEvents(Array.isArray(eventData) ? eventData : []);
      } catch (err) {
        console.error('Failed to fetch category content from API:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryContent();
  }, [categorySlug, subCategorySlug]);

  return (
    <div className="page-container category-subdashboard-page space-y-6">
      
      {/* Category Header Banner */}
      <div className="category-hero-panel bg-white p-6 rounded border border-gray-200 shadow-sm">
        <div className="category-hero-content">
          <div className="breadcrumbs text-xs text-gray-500 mb-3 flex items-center gap-1 font-mono uppercase">
            <Link to="/" className="hover:text-blue-800 flex items-center gap-1"><ArrowLeft size={12} /> Home</Link>
            <span>/</span>
            <Link to={`/category/${currentCategory.slug}`} className="hover:text-blue-800">{currentCategory.name}</Link>
            {subCategorySlug && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-bold">{activeSubCategory?.name || subCategorySlug}</span>
              </>
            )}
          </div>

          <div className="category-header-title-row flex items-start gap-4">
            <div className="category-icon-box p-3 bg-blue-50 text-blue-800 rounded">
              <Trophy size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">
                {subCategorySlug ? `${currentCategory.name} → ${activeSubCategory?.name || subCategorySlug}` : `${currentCategory.name} Section`}
              </h1>
              <p className="text-sm font-serif text-gray-600 mt-1">
                {activeSubCategory?.description || currentCategory.description}
              </p>
            </div>
          </div>

          <div className="category-stats-row flex gap-4 mt-4 pt-4 border-t border-gray-100 text-xs">
            <div className="cat-stat-badge bg-gray-50 px-3 py-1.5 rounded border border-gray-200">
              <strong className="text-gray-900 mr-1">{posts.length}</strong> Published Articles
            </div>
            <div className="cat-stat-badge bg-gray-50 px-3 py-1.5 rounded border border-gray-200">
              <strong className="text-gray-900 mr-1">{events.length}</strong> Upcoming Events
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Categories Navigation Pills */}
      {currentCategory.subCategories && currentCategory.subCategories.length > 0 && (
        <div className="sub-categories-pill-bar bg-white p-3 rounded border border-gray-200 flex items-center gap-3">
          <div className="pill-bar-header flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">
            <Layers size={14} className="text-blue-700" />
            <span>Subcategories:</span>
          </div>
          <div className="pill-scroll-container flex flex-wrap gap-2">
            <Link
              to={`/category/${currentCategory.slug}`}
              className={`px-3 py-1 rounded text-xs font-semibold transition ${!subCategorySlug ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All {currentCategory.name}
            </Link>
            {currentCategory.subCategories.map(sub => (
              <Link
                key={sub.id}
                to={`/category/${currentCategory.slug}/${sub.slug}`}
                className={`px-3 py-1 rounded text-xs font-semibold transition ${subCategorySlug?.toLowerCase() === sub.slug.toLowerCase() ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Content & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          <div className="border-b border-gray-900 pb-2 flex gap-4 text-sm font-semibold">
            <button
              className={`pb-2 border-b-2 transition ${activeTab === 'all' ? 'border-blue-800 text-blue-800' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveTab('all')}
            >
              All Content
            </button>
            <button
              className={`pb-2 border-b-2 transition ${activeTab === 'posts' ? 'border-blue-800 text-blue-800' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveTab('posts')}
            >
              Articles ({posts.length})
            </button>
            <button
              className={`pb-2 border-b-2 transition ${activeTab === 'events' ? 'border-blue-800 text-blue-800' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveTab('events')}
            >
              Events ({events.length})
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-500 font-serif">Loading content...</div>
          ) : (
            <>
              {/* Upcoming Events List */}
              {(activeTab === 'all' || activeTab === 'events') && events.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                    <Calendar size={16} className="text-blue-800" />
                    <span>Scheduled Events</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {events.map(ev => (
                      <EventCard key={ev.id} event={ev} />
                    ))}
                  </div>
                </div>
              )}

              {/* Articles Grid */}
              {(activeTab === 'all' || activeTab === 'posts') && (
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                    <Sparkles size={16} className="text-blue-800" />
                    <span>Latest {subCategorySlug ? activeSubCategory?.name || subCategorySlug : currentCategory.name} Stories</span>
                  </h3>

                  {posts.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded border border-gray-200">
                      <p className="text-sm text-gray-500 font-serif">No published articles in this category yet.</p>
                      <Link to="/write" className="btn btn-primary text-xs mt-3">
                        Publish First Article
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {posts.map(blog => (
                        <BlogCard key={blog.id} blog={blog} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="p-5 bg-white border border-gray-200 rounded">
            <h4 className="font-serif text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">
              About {subCategorySlug ? activeSubCategory?.name || subCategorySlug : currentCategory.name}
            </h4>
            <p className="text-xs text-gray-600 font-serif leading-relaxed mb-4">
              {activeSubCategory?.description || currentCategory.description}
            </p>
            <Link to="/write" className="btn btn-outline text-xs w-full text-center block">
              Write an Article Here
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CategorySubDashboardPage;
