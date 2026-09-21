import React, { useState, useContext, useEffect, useCallback } from 'react';
import { CategoryContext } from '../context/CategoryContext';
import { NotificationContext } from '../context/NotificationContext';
import { AuthContext } from '../context/AuthContext';
import { blogApi } from '../api/blogApi';
import axiosInstance from '../api/axiosConfig';
import { formatDate, calculateReadTime } from '../utils/helpers';
import { 
  PenSquare, FileText, Calendar, PlusCircle, Sparkles, CheckCircle2, 
  AlertCircle, Heart, MessageSquare, Loader2, LogIn, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuthorDashboardPage = () => {
  const { categories } = useContext(CategoryContext);
  const { broadcastPost, broadcastEvent } = useContext(NotificationContext);
  const { user, isAuthenticated } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('create'); // 'create', 'articles', 'events'
  const [contentType, setContentType] = useState('ARTICLE'); // 'ARTICLE' or 'EVENT'

  // Form State
  const [title, setTitle] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('');
  const [selectedSubCatName, setSelectedSubCatName] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  // Event Specific Form State
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('');

  // Publishing status states
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState('');
  const [publishError, setPublishError] = useState('');

  // My Articles state
  const [myArticles, setMyArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [articlesError, setArticlesError] = useState('');

  // My Events state
  const [myEvents, setMyEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const currentSelectedCategory = categories.find(
    c => String(c.id) === String(selectedCatId) || c.slug === selectedCatId
  );
  const availableSubCategories = currentSelectedCategory ? (currentSelectedCategory.subCategories || []) : [];

  const fetchMyArticles = useCallback(async () => {
    if (!isAuthenticated) {
      setMyArticles([]);
      return;
    }
    setLoadingArticles(true);
    setArticlesError('');
    try {
      const data = await blogApi.getMyBlogs();
      setMyArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load my articles:', err);
      setArticlesError(err.response?.data?.message || err.message || 'Failed to load your articles from server.');
    } finally {
      setLoadingArticles(false);
    }
  }, [isAuthenticated]);

  const fetchMyEvents = useCallback(async () => {
    setLoadingEvents(true);
    try {
      const res = await axiosInstance.get('/events');
      setMyEvents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.warn('Failed to load events:', err);
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'articles') {
      fetchMyArticles();
    } else if (activeTab === 'events') {
      fetchMyEvents();
    }
  }, [activeTab, fetchMyArticles, fetchMyEvents]);

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchMyArticles();
    }
    fetchMyEvents();
  }, [isAuthenticated, fetchMyArticles, fetchMyEvents]);

  const handlePublish = async (e) => {
    e.preventDefault();
    setPublishError('');
    setPublishSuccess('');

    if (!isAuthenticated) {
      setPublishError('Please log in to your account to publish articles.');
      return;
    }

    if (!title.trim()) {
      setPublishError('Please provide an article title.');
      return;
    }

    if (!selectedCatId) {
      setPublishError('Please select a main channel/category.');
      return;
    }

    if (contentType === 'ARTICLE' && !content.trim()) {
      setPublishError('Article content body cannot be empty.');
      return;
    }

    const categoryObj = currentSelectedCategory || { id: 1, name: 'Technology', slug: 'technology' };
    const subCatName = selectedSubCatName || availableSubCategories[0]?.name || 'General';

    setIsPublishing(true);

    try {
      if (contentType === 'ARTICLE') {
        const payload = {
          title: title.trim(),
          summary: summary.trim(),
          content: content.trim(),
          coverImageUrl: coverImageUrl.trim() || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
          categoryId: Number(selectedCatId) || categoryObj.id || null,
          categorySlug: categoryObj.slug || null,
          categoryName: categoryObj.name || null,
          subCategoryName: subCatName,
          status: 'PUBLISHED',
          tagNames: []
        };

        const response = await blogApi.createBlog(payload);

        setPublishSuccess(`Article "${response.title}" successfully published & saved to Railway MySQL!`);
        broadcastPost(response);

        // Reset form
        setTitle('');
        setSummary('');
        setContent('');
        setCoverImageUrl('');
        setSelectedCatId('');
        setSelectedSubCatName('');

        // Refresh my articles
        fetchMyArticles();
      } else {
        const newEvent = {
          title: title.trim(),
          description: summary.trim() || content.trim(),
          categoryName: categoryObj.name,
          subCategoryName: subCatName,
          eventDate: eventDate || new Date().toISOString().split('T')[0],
          eventTime: eventTime || '10:00 AM PST',
          location: location.trim() || 'Main Campus Center',
          registrationUrl: registrationUrl.trim() || 'https://example.com/register',
          status: 'UPCOMING',
          organizer: user?.fullName || user?.username || 'Alex Rivera',
          coverImageUrl: coverImageUrl.trim() || 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80'
        };

        const res = await axiosInstance.post('/events', newEvent);
        const savedEvent = res.data;

        broadcastEvent(savedEvent);
        setPublishSuccess(`Upcoming Event "${savedEvent.title}" scheduled and saved successfully!`);

        setTitle('');
        setSummary('');
        setContent('');
        setCoverImageUrl('');
        setEventDate('');
        setEventTime('');
        setLocation('');
        setRegistrationUrl('');

        fetchMyEvents();
      }
    } catch (err) {
      console.error('Publishing failed:', err);
      const errorDetail = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to publish. Please check your network and try again.';
      setPublishError(`Publishing Error: ${errorDetail}`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="page-container author-dashboard-page space-y-6">
      
      {/* Hero Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
            <PenSquare size={13} className="animate-pulse" />
            <span>Author & Creator Studio</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900">Publish Articles & Upcoming Events</h1>
          <p className="text-sm text-slate-600">
            Create high-impact content, target channels and subtopics, and broadcast real-time updates to your readers.
          </p>
        </div>
      </div>

      {/* Auth Prompt if not logged in */}
      {!isAuthenticated && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="text-amber-600 shrink-0" />
            <span>You are currently not logged in. Please sign in to publish articles to the database.</span>
          </div>
          <Link to="/login" className="btn btn-xs btn-primary flex items-center gap-1.5 shrink-0">
            <LogIn size={14} />
            <span>Log In</span>
          </Link>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex gap-3 border-b border-slate-200 pb-3">
        <button
          className={`pill-btn text-xs inline-flex items-center gap-1.5 ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <PlusCircle size={14} />
          <span>Publish New Content</span>
        </button>

        <button
          className={`pill-btn text-xs inline-flex items-center gap-1.5 ${activeTab === 'articles' ? 'active' : ''}`}
          onClick={() => setActiveTab('articles')}
        >
          <FileText size={14} />
          <span>My Articles ({myArticles.length})</span>
        </button>

        <button
          className={`pill-btn text-xs inline-flex items-center gap-1.5 ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <Calendar size={14} />
          <span>My Events ({myEvents.length})</span>
        </button>
      </div>

      {/* TAB 1: CREATE / PUBLISH CONTENT FORM */}
      {activeTab === 'create' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm max-w-4xl mx-auto space-y-6">
          
          {/* Content Type Selector */}
          <div className="flex gap-4 p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
            <button
              type="button"
              className={`flex-1 py-2.5 font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition ${contentType === 'ARTICLE' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              onClick={() => setContentType('ARTICLE')}
            >
              <FileText size={16} />
              <span>Publish Article / Blog</span>
            </button>

            <button
              type="button"
              className={`flex-1 py-2.5 font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition ${contentType === 'EVENT' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              onClick={() => setContentType('EVENT')}
            >
              <Calendar size={16} />
              <span>Publish Upcoming Event</span>
            </button>
          </div>

          {/* Success Notification Alert */}
          {publishSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between gap-3 text-sm animate-fadeIn">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span className="font-medium">{publishSuccess}</span>
              </div>
              <button 
                onClick={() => setActiveTab('articles')}
                className="btn btn-xs btn-outline text-emerald-700 border-emerald-300 hover:bg-emerald-100"
              >
                View in My Articles →
              </button>
            </div>
          )}

          {/* Error Notification Alert */}
          {publishError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 text-sm animate-shake">
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
              <span className="font-medium">{publishError}</span>
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-5">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                {contentType === 'ARTICLE' ? 'Article Title' : 'Event Name'} *
              </label>
              <input
                type="text"
                className="input-field text-base font-semibold"
                placeholder={contentType === 'ARTICLE' ? 'e.g. Modern React 19 Patterns Every Engineer Should Know...' : 'e.g. Global Developer Conference 2026...'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Hierarchical Category & Sub-Category Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Main Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Main Channel / Category *</label>
                <select
                  className="input-field text-sm cursor-pointer"
                  value={selectedCatId}
                  onChange={(e) => {
                    setSelectedCatId(e.target.value);
                    setSelectedSubCatName('');
                  }}
                  required
                >
                  <option value="">Select Main Channel...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Sub-Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Subtopic *</label>
                <select
                  className="input-field text-sm cursor-pointer"
                  value={selectedSubCatName}
                  onChange={(e) => setSelectedSubCatName(e.target.value)}
                  disabled={!selectedCatId}
                  required
                >
                  <option value="">Select Subtopic...</option>
                  {availableSubCategories.map(sub => (
                    <option key={sub.id} value={sub.name}>{sub.name}</option>
                  ))}
                </select>
                {selectedCatId && availableSubCategories.length === 0 && (
                  <p className="text-xs text-slate-400 mt-1 italic">No subtopics defined. General will be used.</p>
                )}
              </div>

            </div>

            {/* Event Specific Inputs */}
            {contentType === 'EVENT' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Event Date *</label>
                  <input
                    type="date"
                    className="input-field text-sm"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Event Time</label>
                  <input
                    type="text"
                    className="input-field text-sm"
                    placeholder="e.g. 09:00 AM PST"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Location / Venue *</label>
                  <input
                    type="text"
                    className="input-field text-sm"
                    placeholder="e.g. Moscone Convention Center, San Francisco, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Registration / RSVP Link</label>
                  <input
                    type="url"
                    className="input-field text-sm"
                    placeholder="https://example.com/register"
                    value={registrationUrl}
                    onChange={(e) => setRegistrationUrl(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Cover Image URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Cover Image URL</label>
              <input
                type="url"
                className="input-field text-sm"
                placeholder="https://images.unsplash.com/..."
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
              />
            </div>

            {/* Summary / Excerpt */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Summary / Excerpt</label>
              <input
                type="text"
                className="input-field text-sm"
                placeholder="Short 1-2 sentence teaser summary..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>

            {/* Main Content Body */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Main Content Body *</label>
              <textarea
                className="input-field font-mono text-sm"
                rows="8"
                placeholder="Write article details using Markdown or plain text..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isPublishing}
              className="btn btn-primary btn-pill w-full py-3 flex items-center justify-center gap-2 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPublishing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Saving Article to MySQL...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Publish & Save to Railway MySQL</span>
                </>
              )}
            </button>

          </form>

        </div>
      )}

      {/* TAB 2: MY ARTICLES (REAL PERSISTED DATA) */}
      {activeTab === 'articles' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-slate-900">
              My Published Articles ({myArticles.length})
            </h3>
            {isAuthenticated && (
              <button 
                onClick={fetchMyArticles} 
                disabled={loadingArticles}
                className="btn btn-xs btn-outline"
              >
                {loadingArticles ? 'Refreshing...' : 'Refresh'}
              </button>
            )}
          </div>

          {loadingArticles ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500 gap-2">
              <Loader2 size={24} className="animate-spin text-blue-600" />
              <span className="text-xs">Loading articles from MySQL...</span>
            </div>
          ) : articlesError ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{articlesError}</span>
            </div>
          ) : myArticles.length > 0 ? (
            <div className="space-y-3">
              {myArticles.map(blog => (
                <div key={blog.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300 transition flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-slate-900 leading-snug">{blog.title}</h4>
                    <p className="text-xs text-slate-500">
                      Channel: <span className="text-blue-600 font-semibold">{blog.category?.name} → {blog.subCategoryName || 'General'}</span> | {formatDate(blog.createdAt)} | {calculateReadTime(blog.content)}
                    </p>
                    <span className="badge badge-success text-[10px] uppercase font-bold">{blog.status}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 shrink-0">
                    <span className="flex items-center gap-1" title="Likes"><Heart size={13} className="text-rose-500" /> {blog.likesCount || 0}</span>
                    <span className="flex items-center gap-1" title="Comments"><MessageSquare size={13} className="text-blue-500" /> {blog.commentsCount || 0}</span>
                    <Link to={`/blog/${blog.slug || blog.id}`} className="btn btn-xs btn-outline flex items-center gap-1">
                      <span>View</span>
                      <ExternalLink size={11} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <FileText size={36} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No published articles found yet</p>
              <p className="text-xs text-slate-400 mt-1">Publish your first article using the creator form above.</p>
              <button 
                onClick={() => setActiveTab('create')} 
                className="btn btn-sm btn-primary mt-4"
              >
                Write an Article Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MY EVENTS */}
      {activeTab === 'events' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-4">Scheduled Events ({myEvents.length})</h3>
          {loadingEvents ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500 gap-2">
              <Loader2 size={24} className="animate-spin text-blue-600" />
              <span className="text-xs">Loading events...</span>
            </div>
          ) : myEvents.length > 0 ? (
            <div className="space-y-3">
              {myEvents.map(ev => (
                <div key={ev.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300 transition flex justify-between items-center gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 leading-snug">{ev.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {ev.categoryName} → {ev.subCategoryName} | Date: <span className="text-blue-600 font-semibold">{ev.eventDate}</span> ({ev.location})
                    </p>
                  </div>
                  <span className="badge badge-success text-xs shrink-0">{ev.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Calendar size={36} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No upcoming events scheduled</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default AuthorDashboardPage;

