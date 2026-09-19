import React, { useState, useEffect, useContext } from 'react';
import { newsApi } from '../api/newsApi';
import { CategoryContext } from '../context/CategoryContext';
import { NotificationContext } from '../context/NotificationContext';
import { NewsCard } from '../components/NewsCard';
import { 
  Newspaper, Radio, Flame, Award, Clock, Search, 
  ArrowUpDown, RefreshCw, Sparkles, Layers 
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
  const [sortOption, setSortOption] = useState('newest');
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

      setNewsList(data || []);
      setBreakingNews(breaking || []);
      setTopStories(top || []);
      setTrendingNews(trending || []);
    } catch (err) {
      console.error('Failed to load news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [selectedCategory, selectedSubCategory, sortOption]);

  // Automatic REST Polling for new news updates
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
        <div className="bg-white border border-rose-200 rounded-2xl p-6 border-l-4 border-l-rose-500 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="badge badge-pink animate-pulse flex items-center gap-1 font-bold">
                <Radio size={13} /> BREAKING NEWS
              </span>
              <span className="text-xs text-slate-500">Live Coverage</span>
            </div>
            <button
              onClick={() => setPollingActive(!pollingActive)}
              className={`btn btn-xs ${pollingActive ? 'btn-outline text-emerald-600 border-emerald-200 bg-emerald-50' : 'btn-secondary'} flex items-center gap-1`}
              title="Toggle live updates"
            >
              <RefreshCw size={11} className={pollingActive ? 'animate-spin' : ''} />
              <span>{pollingActive ? 'Live Polling Active' : 'Polling Paused'}</span>
            </button>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 hover:text-blue-600 transition leading-snug">
            <Link to={`/news/${breakingNews[0].slug || breakingNews[0].id}`}>
              {breakingNews[0].title}
            </Link>
          </h2>
          <p className="text-sm text-slate-600 mt-2 line-clamp-2">{breakingNews[0].summary}</p>
        </div>
      )}

      {/* Main Title & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Newspaper size={24} className="text-blue-600" />
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900">Keryx Latest News</h1>
          </div>
          <p className="text-xs text-slate-500">
            Real-time news coverage across Technology, AI, Cloud, Business & Global Affairs.
          </p>
        </div>

        {/* Search & Sort Bar */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="input-field pl-9 text-xs"
              placeholder="Search news stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="input-field text-xs font-semibold py-2 pr-8 cursor-pointer"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Viewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category & Subcategory Filter Tabs */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Layers size={15} className="text-blue-600" />
          <span className="text-xs font-bold uppercase text-slate-600">News Channels:</span>
        </div>

        <div className="quick-category-pills">
          <button
            className={`pill-btn text-xs ${selectedCategory === '' ? 'active' : ''}`}
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
              className={`pill-btn text-xs ${selectedCategory.toLowerCase() === cat.name.toLowerCase() ? 'active' : ''}`}
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
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-blue-600 mr-1 shrink-0">Subtopics:</span>
            <button
              className={`pill-btn text-xs ${selectedSubCategory === '' ? 'active' : ''}`}
              onClick={() => setSelectedSubCategory('')}
            >
              All {currentCategoryObj.name}
            </button>
            {availableSubCategories.map(sub => (
              <button
                key={sub.id}
                className={`pill-btn text-xs ${selectedSubCategory.toLowerCase() === sub.name.toLowerCase() ? 'active' : ''}`}
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
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles size={18} className="text-blue-600" />
              <span>Latest News Stream ({filteredNews.length})</span>
            </h3>
          </div>

          {loading ? (
            <div className="bg-white border border-slate-200 p-12 text-center text-slate-500 rounded-2xl">
              <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-sm">Fetching latest news stream...</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="bg-white border border-slate-200 p-12 text-center rounded-2xl">
              <p className="text-slate-500 text-sm">No news stories matching your search keywords or filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredNews.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Top Stories & Trending */}
        <div className="space-y-6">
          
          {/* Top Stories Panel */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <Award size={18} className="text-blue-600" />
              <h3 className="font-bold text-base text-slate-900">Top Stories</h3>
            </div>

            <div className="space-y-4">
              {topStories.slice(0, 4).map((story, idx) => (
                <div key={story.id} className="group">
                  <div className="flex gap-3">
                    <span className="font-extrabold text-slate-300 text-lg group-hover:text-blue-600 transition">0{idx + 1}</span>
                    <div>
                      <span className="badge badge-primary text-[10px] mb-1">{story.categoryName}</span>
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
                        <Link to={`/news/${story.slug || story.id}`}>{story.title}</Link>
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Clock size={11} /> {story.viewsCount || 0} reads
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending News Panel */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <Flame size={18} className="text-amber-500" />
              <h3 className="font-bold text-base text-slate-900">Trending Now</h3>
            </div>

            <div className="space-y-3">
              {trendingNews.slice(0, 3).map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-slate-300 transition">
                  <span className="text-[11px] font-bold text-blue-600 uppercase">{item.categoryName}</span>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-2 hover:text-blue-600 transition">
                    <Link to={`/news/${item.slug || item.id}`}>{item.title}</Link>
                  </h4>
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
