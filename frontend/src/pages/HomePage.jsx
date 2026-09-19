import React, { useState, useContext } from 'react';
import { MOCK_BLOGS } from '../mockData';
import { CategoryContext } from '../context/CategoryContext';
import { BlogCard } from '../components/BlogCard';
import { LiveTicker } from '../components/LiveTicker';
import { 
  Sparkles, TrendingUp, SearchX,
  ArrowRight, Layers
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
  
  const urlQuery = searchParams.get('q') || searchQuery || '';

  // Get selected category object if any
  const currentCategoryObj = categories.find(c => c.slug === selectedCategory);

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

  const handleTrendingClick = (term) => {
    setSearchParams({ q: term });
  };

  return (
    <div className="home-page-container flex flex-col gap-6">
      
      {/* Live Breaking Updates Ticker */}
      <LiveTicker />

      {/* Modern Balanced Editorial Publishing Section */}
      {!selectedCategory && !urlQuery && (
        <>
          {/* 1. Header Banner & Quick Action Bar */}
          <section className="editorial-hero-banner bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <div className="editorial-hero-badge mb-2">
                <span className="geo-bullet" />
                <span>KERYX DIGITAL PUBLISHING</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Publish your stories, <span className="text-highlight-blue">insights</span> & ideas boldly.
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                The modern digital publication platform for developers, creators, thinkers, and researchers across technology, AI, programming, science, business, and lifestyle.
              </p>
            </div>
            <div className="hero-cta-group shrink-0 flex items-center gap-3">
              <Link to="/write" className="btn btn-primary btn-hero-cta">
                Start Writing
              </Link>
              <Link to="/explore" className="btn btn-secondary btn-hero-cta">
                Explore Channels
              </Link>
            </div>
          </section>

          {/* 2. Trending Searches Quick Bar */}
          <section className="trending-searches-section flex flex-wrap items-center gap-2.5 py-3 px-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="trending-label flex items-center gap-1.5 text-xs font-bold text-slate-700 shrink-0">
              <TrendingUp size={15} className="text-blue-600" />
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

          {/* 3. Featured & Editorial Stories (Standard 3-Column Responsive Grid) */}
          <section className="featured-stories-section space-y-4">
            <div className="section-title-row flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#071A3D] flex items-center gap-2">
                <Sparkles size={20} className="text-[#146EF5]" />
                <span>Featured & Editorial Stories</span>
              </h3>
              <span className="text-xs text-[#60789B] font-medium">Curated top publications</span>
            </div>

            <div className="blogs-grid">
              {blogs.slice(0, 3).map((blog) => (
                <BlogCard key={`featured-grid-${blog.id}`} blog={blog} />
              ))}
            </div>
          </section>

          {/* 4. Editorial Spotlight & Recommended Stories (Standard 3-Column Responsive Grid) */}
          <section className="editorial-spotlight-section space-y-4">
            <div className="section-title-row flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-[#146EF5]" />
                <h3 className="text-xl font-bold text-[#071A3D]">Editorial Spotlight & Recommended Stories</h3>
              </div>
              <span className="text-xs text-[#60789B] font-medium">Curated editor recommendations</span>
            </div>

            <div className="blogs-grid">
              {blogs.slice(3, 6).map((blog) => (
                <BlogCard key={`spotlight-grid-${blog.id}`} blog={blog} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Main Feed Section / Search Results */}
      <section id="feed" className="feed-section space-y-6">
        <div className="feed-header flex flex-wrap justify-between items-center gap-4">
          <div className="feed-title-wrap flex items-center gap-2">
            <TrendingUp className="text-blue" size={24} />
            <h2 className="text-2xl font-bold text-slate-900">
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
          <div className="blogs-grid">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="empty-state bg-white border border-slate-200 text-center py-16 rounded-2xl shadow-sm">
            <SearchX size={48} className="mx-auto text-slate-400 mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No articles found matching your query</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search keywords or topic filter.</p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); setSearchParams({}); }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* Category Explorer Channels Grid */}
      {!selectedCategory && !urlQuery && (
        <section className="category-explorer-section space-y-6">
          <div className="section-title-row flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Layers size={22} className="text-blue" />
              <span>Explore Content Channels & Topics</span>
            </h3>
            <Link to="/explore" className="text-xs text-blue hover:underline font-semibold">Browse All Channels →</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.slice(0, 9).map(cat => (
              <div key={cat.id} className="category-card-hub p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <h4 className="font-bold text-lg text-slate-900">{cat.name}</h4>
                    <span className="badge badge-outline text-[11px]">{cat.subCategories?.length || 0} Subtopics</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">{cat.description}</p>
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
