import React, { useState, useEffect, useContext } from 'react';
import { newsApi } from '../api/newsApi';
import { CategoryContext } from '../context/CategoryContext';
import { NotificationContext } from '../context/NotificationContext';
import { NewsCard } from '../components/NewsCard';
import { 
  Newspaper, Radio, Flame, Award, Clock, Search, Filter, 
  ArrowUpDown, RefreshCw, Sparkles, Layers, ChevronRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const NewsPage = () => {
  const { categories } = useContext(CategoryContext);
  const { broadcastPost } = useContext(NotificationContext);

  const [newsList, setNewsList] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);
  const [topStories, setTopStories] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [sortOption, setSortOption] = useState('newest'); // 'newest', 'oldest', 'popular'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [pollingActive, setPollingActive] = useState(true);

  // Fetch initial news data
  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await newsApi.getAllNews(selectedCategory, selectedSubCategory, sortOption);
      const breaking = await newsApi.getBreakingNews();
      const top = await newsApi.getTopStories();
      const trending = await newsApi.getTrendingNews();

      setNewsList(data);
      setBreakingNews(breaking);
      setTopStories(top);
      setTrendingNews(trending);
    } catch (err) {
      console.error('Failed to load news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [selectedCategory, selectedSubCategory, sortOption]);

  // Automatic REST Polling for new news updates every 12 seconds
  useEffect(() => {
    if (!pollingActive) return;

    const interval = setInterval(async () => {
      try {
        const latestItems = await newsApi.getLatestNews(5);
        if (latestItems && latestItems.length > 0) {
          setNewsList(prev => {
            const existingIds = new Set(prev.map(item => item.id));
            const newItems = latestItems.filter(item => !existingIds.has(item.id));
            
            if (newItems.length > 0) {
              // Trigger live notification toast for new breaking news story
              newItems.forEach(item => {
                broadcastPost({
                  title: item.title,
                  category: { name: item.categoryName },
                  subCategoryName: item.subCategoryName,
                  slug: item.slug
                });
              });
              return [...newItems, ...prev];
            }
            return prev;
          });
        }
      } catch (e) {
        // Silent catch for background polling
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [pollingActive]);

  const currentCategoryObj = categories.find(c => c.name.toLowerCase() === selectedCategory.toLowerCase() || c.slug === selectedCategory);
  const availableSubCategories = currentCategoryObj ? (currentCategoryObj.subCategories || []) : [];

  // Filter news client side for search query
  const filteredNews = newsList.filter(n => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return n.title?.toLowerCase().includes(q) ||
           n.summary?.toLowerCase().includes(q) ||
           n.categoryName?.toLowerCase().includes(q) ||
           n.subCategoryName?.toLowerCase().includes(q);
  });

  return (
    <div className="page-container news-page-container space-y-8">
      
      {/* Breaking News Banner Header */}
      {breakingNews.length > 0 && (
        <div className="breaking-news-hero glass-panel p-6 border-l-4 border-pink-500 relative overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="badge badge-pink animate-pulse flex items-center gap-1 font-bold">
                <Radio size={14} /> BREAKING NEWS
              </span>
              <span className="text-xs text-muted">Updated Live via REST Polling Engine</span>
            </div>
            <button
              onClick={() => setPollingActive(!pollingActive)}
              className={`btn btn-xs ${pollingActive ? 'btn-success' : 'btn-secondary'} flex items-center gap-1`}
              title="Toggle automatic background REST polling"
            >
              <RefreshCw size={12} className={pollingActive ? 'animate-spin' : ''} />
              <span>{pollingActive ? 'Live Polling Active' : 'Polling Paused'}</span>
            </button>
          </div>

          <h2 className="text-2xl font-extrabold hover:text-pink transition">
            <Link to={`/news/${breakingNews[0].slug || breakingNews[0].id}`}>
              {breakingNews[0].title}
            </Link>
          </h2>
          <p className="text-sm text-muted mt-2 line-clamp-2">{breakingNews[0].summary}</p>
        </div>
      )}

      {/* Main Title & Search Bar */}
      <div className="news-title-bar flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Newspaper size={24} className="text-cyan" />
            <h1 className="text-3xl font-extrabold">Keryx Latest News</h1>
          </div>
          <p className="text-xs text-muted">
            Real-time news coverage across Sports, Technology, Politics, Entertainment & World Affairs.
          </p>
        </div>

        {/* Search & Sort Bar */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="search-input-wrap flex-1 md:w-64 relative">
            <Search size={16} className="absolute left-3 top-3 text-muted" />
            <input
              type="text"
              className="input-field pl-9"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="sort-wrapper relative">
            <select
              className="input-field select-field pl-8"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="popular">Sort: Most Viewed</option>
            </select>
            <ArrowUpDown size={14} className="absolute left-3 top-3 text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category & Subcategory Filter Tabs */}
      <div className="news-category-filter-bar glass-panel p-4 rounded-xl space-y-3">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-pink" />
          <span className="text-xs font-bold uppercase text-muted">News Categories:</span>
        </div>

        <div className="category-pills-row justify-start">
          <button
            className={`pill-btn ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory('');
              setSelectedSubCategory('');
            }}
          >
            All News
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`pill-btn ${selectedCategory.toLowerCase() === cat.name.toLowerCase() ? 'active' : ''}`}
              onClick={() => {
                if (selectedCategory.toLowerCase() === cat.name.toLowerCase()) {
                  setSelectedCategory('');
                  setSelectedSubCategory('');
                } else {
                  setSelectedCategory(cat.name);
                  setSelectedSubCategory('');
                }
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sub-Category Pills Bar if Category selected */}
        {selectedCategory && availableSubCategories.length > 0 && (
          <div className="sub-pills-subbar pt-3 border-t border-glass flex items-center justify-start gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-cyan mr-1">Sub-Categories:</span>
            <button
              className={`pill-btn pill-btn-sm ${selectedSubCategory === '' ? 'active' : ''}`}
              onClick={() => setSelectedSubCategory('')}
            >
              All {currentCategoryObj.name}
            </button>
            {availableSubCategories.map(sub => (
              <button
                key={sub.id}
                className={`pill-btn pill-btn-sm ${selectedSubCategory.toLowerCase() === sub.name.toLowerCase() ? 'active' : ''}`}
                onClick={() => setSelectedSubCategory(selectedSubCategory.toLowerCase() === sub.name.toLowerCase() ? '' : sub.name)}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid Layout: News Feed + Top Stories Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Latest News Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Sparkles size={18} className="text-cyan" />
              <span>Latest News Stream ({filteredNews.length})</span>
            </h3>
          </div>

          {loading ? (
            <div className="glass-panel p-12 text-center text-muted">
              <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
              <p>Fetching latest news stream...</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="glass-panel p-12 text-center">
              <p className="text-muted">No news stories found matching your filter criteria.</p>
              <button
                onClick={() => { setSelectedCategory(''); setSelectedSubCategory(''); setSearchQuery(''); }}
                className="btn btn-secondary mt-3"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNews.map(news => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Widgets: Top Stories & Trending News */}
        <div className="space-y-6">
          
          {/* Top Stories Widget */}
          <div className="sidebar-widget glass-panel p-5">
            <div className="widget-header flex items-center gap-2 mb-4 pb-2 border-b border-glass">
              <Award size={18} className="text-cyan" />
              <h4 className="font-bold text-base">Top Stories</h4>
            </div>

            <div className="space-y-4">
              {topStories.map(story => (
                <div key={story.id} className="top-story-item">
                  <span className="badge badge-outline text-xs mb-1">{story.categoryName}</span>
                  <h5 className="font-bold text-sm leading-snug hover:text-cyan transition mb-1">
                    <Link to={`/news/${story.slug || story.id}`}>{story.title}</Link>
                  </h5>
                  <span className="text-xs text-muted flex items-center gap-1">
                    <Clock size={11} /> {story.publishedAt ? new Date(story.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Trending News Widget */}
          <div className="sidebar-widget glass-panel p-5">
            <div className="widget-header flex items-center gap-2 mb-4 pb-2 border-b border-glass">
              <Flame size={18} className="text-pink" />
              <h4 className="font-bold text-base">Trending News</h4>
            </div>

            <div className="space-y-4">
              {trendingNews.map(item => (
                <div key={item.id} className="trending-news-item flex gap-3 items-center">
                  <div className="trending-num font-black text-2xl text-pink opacity-80">
                    #{trendingNews.indexOf(item) + 1}
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm leading-snug hover:text-pink transition">
                      <Link to={`/news/${item.slug || item.id}`}>{item.title}</Link>
                    </h5>
                    <span className="text-xs text-muted">{item.viewsCount} views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default NewsPage;
