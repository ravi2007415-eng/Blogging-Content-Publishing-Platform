import React, { useState, useContext, useEffect, useCallback } from 'react';
import { CategoryContext } from '../context/CategoryContext';
import { NotificationContext } from '../context/NotificationContext';
import { AuthContext } from '../context/AuthContext';
import { blogApi } from '../api/blogApi';
import axiosInstance from '../api/axiosConfig';
import { formatDate, calculateReadTime } from '../utils/helpers';
import {
  PenSquare,
  FileText,
  Calendar,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Heart,
  MessageSquare,
  Loader2,
  LogIn,
  ExternalLink,
  MapPin,
  Clock3,
  Image as ImageIcon,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuthorDashboardPage = () => {
  const { categories } = useContext(CategoryContext);
  const { broadcastPost, broadcastEvent } = useContext(NotificationContext);
  const { user, isAuthenticated } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('create');
  const [contentType, setContentType] = useState('ARTICLE');

  // Form State
  const [title, setTitle] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('');
  const [selectedSubCatName, setSelectedSubCatName] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  // Event State
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('');

  // Publishing State
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState('');
  const [publishError, setPublishError] = useState('');

  // Articles
  const [myArticles, setMyArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [articlesError, setArticlesError] = useState('');

  // Events
  const [myEvents, setMyEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const currentSelectedCategory = categories.find(
    c =>
      String(c.id) === String(selectedCatId) ||
      c.slug === selectedCatId
  );

  const availableSubCategories = currentSelectedCategory
    ? currentSelectedCategory.subCategories || []
    : [];

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
      setArticlesError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load your articles from server.'
      );
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyArticles();
    }

    fetchMyEvents();
  }, [isAuthenticated, fetchMyArticles, fetchMyEvents]);

  const resetForm = () => {
    setTitle('');
    setSummary('');
    setContent('');
    setCoverImageUrl('');
    setSelectedCatId('');
    setSelectedSubCatName('');
    setEventDate('');
    setEventTime('');
    setLocation('');
    setRegistrationUrl('');
  };

  const handlePublish = async e => {
    e.preventDefault();

    setPublishError('');
    setPublishSuccess('');

    if (!isAuthenticated) {
      setPublishError('Please log in to your account to publish articles.');
      return;
    }

    if (!title.trim()) {
      setPublishError(
        contentType === 'ARTICLE'
          ? 'Please provide an article title.'
          : 'Please provide an event name.'
      );
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

    const categoryObj = currentSelectedCategory || {
      id: 1,
      name: 'Technology',
      slug: 'technology'
    };

    const subCatName =
      selectedSubCatName ||
      availableSubCategories[0]?.name ||
      'General';

    setIsPublishing(true);

    try {
      if (contentType === 'ARTICLE') {
        const payload = {
          title: title.trim(),
          summary: summary.trim(),
          content: content.trim(),
          coverImageUrl:
            coverImageUrl.trim() ||
            'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
          categoryId: Number(selectedCatId) || categoryObj.id || null,
          categorySlug: categoryObj.slug || null,
          categoryName: categoryObj.name || null,
          subCategoryName: subCatName,
          status: 'PUBLISHED',
          tagNames: []
        };

        const response = await blogApi.createBlog(payload);

        setPublishSuccess(
          `Article "${response.title}" successfully published and saved.`
        );

        broadcastPost(response);

        resetForm();
        fetchMyArticles();
      } else {
        const newEvent = {
          title: title.trim(),
          description: summary.trim() || content.trim(),
          categoryName: categoryObj.name,
          subCategoryName: subCatName,
          eventDate:
            eventDate || new Date().toISOString().split('T')[0],
          eventTime: eventTime || '10:00 AM PST',
          location: location.trim() || 'Main Campus Center',
          registrationUrl:
            registrationUrl.trim() || 'https://example.com/register',
          status: 'UPCOMING',
          organizer:
            user?.fullName ||
            user?.username ||
            'Author',
          coverImageUrl:
            coverImageUrl.trim() ||
            'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80'
        };

        const res = await axiosInstance.post('/events', newEvent);
        const savedEvent = res.data;

        broadcastEvent(savedEvent);

        setPublishSuccess(
          `Upcoming Event "${savedEvent.title}" scheduled successfully.`
        );

        resetForm();
        fetchMyEvents();
      }
    } catch (err) {
      console.error('Publishing failed:', err);

      const errorDetail =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to publish. Please check your network and try again.';

      setPublishError(`Publishing Error: ${errorDetail}`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="page-container author-dashboard-page space-y-6">

      {/* =========================================================
          HEADER
      ========================================================== */}
      <section className="relative overflow-hidden bg-slate-950 rounded-2xl border border-slate-800 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/70 via-slate-950 to-slate-950" />

        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute left-1/3 bottom-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative px-6 py-8 lg:px-10 lg:py-10">
          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-300 mb-4">
              <PenSquare size={15} />
              <span>Author Studio</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Create. Publish. Share.
            </h1>

            <p className="mt-3 max-w-2xl text-sm lg:text-base leading-7 text-slate-300">
              Write useful articles, share ideas with your readers and
              publish upcoming events from one place.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-300">
              <div className="inline-flex items-center gap-2 border border-slate-700 bg-slate-900/60 rounded-lg px-3 py-2">
                <FileText size={14} />
                <span>{myArticles.length} Articles</span>
              </div>

              <div className="inline-flex items-center gap-2 border border-slate-700 bg-slate-900/60 rounded-lg px-3 py-2">
                <Calendar size={14} />
                <span>{myEvents.length} Events</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          LOGIN NOTICE
      ========================================================== */}
      {!isAuthenticated && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div>
              <p className="text-sm font-semibold text-amber-900">
                Sign in required
              </p>

              <p className="mt-1 text-xs text-amber-800">
                Please sign in before publishing content.
              </p>
            </div>
          </div>

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
          >
            <LogIn size={14} />
            Log In
          </Link>
        </div>
      )}

      {/* =========================================================
          NAVIGATION
      ========================================================== */}
      <div className="border-b border-slate-200">
        <div className="flex flex-wrap gap-1">

          <button
            onClick={() => setActiveTab('create')}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition ${
              activeTab === 'create'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <PlusCircle size={16} />
            Create
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition ${
              activeTab === 'articles'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText size={16} />
            My Articles
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px]">
              {myArticles.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition ${
              activeTab === 'events'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar size={16} />
            My Events
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px]">
              {myEvents.length}
            </span>
          </button>

        </div>
      </div>

      {/* =========================================================
          CREATE TAB
      ========================================================== */}
      {activeTab === 'create' && (
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Section heading */}
          <div className="px-6 py-6 lg:px-8 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Publish New Content
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create an article or add an upcoming event for your audience.
            </p>
          </div>

          <div className="p-6 lg:p-8">

            {/* Content Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">

              <button
                type="button"
                onClick={() => setContentType('ARTICLE')}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  contentType === 'ARTICLE'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    contentType === 'ARTICLE'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <FileText size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Article / Blog
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Publish a new article
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setContentType('EVENT')}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  contentType === 'EVENT'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    contentType === 'EVENT'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Calendar size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Upcoming Event
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Schedule an event
                  </p>
                </div>
              </button>

            </div>

            {/* Alerts */}
            {publishSuccess && (
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-emerald-900">
                      Published successfully
                    </p>

                    <p className="mt-1 text-xs text-emerald-800">
                      {publishSuccess}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('articles')}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-300 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition"
                >
                  View Articles
                  <ArrowRight size={13} />
                </button>

              </div>
            )}

            {publishError && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
                <AlertCircle
                  size={19}
                  className="mt-0.5 shrink-0 text-rose-600"
                />

                <div>
                  <p className="text-sm font-semibold text-rose-900">
                    Publishing failed
                  </p>

                  <p className="mt-1 text-xs text-rose-800">
                    {publishError}
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handlePublish}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >

              {/* =====================================================
                  MAIN EDITOR
              ====================================================== */}
              <div className="lg:col-span-2 space-y-6">

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    {contentType === 'ARTICLE'
                      ? 'Article title'
                      : 'Event name'}
                    <span className="text-rose-500"> *</span>
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder={
                      contentType === 'ARTICLE'
                        ? 'Write a clear and engaging title'
                        : 'Enter the event name'
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    required
                  />

                  <div className="mt-2 flex justify-end text-[11px] text-slate-400">
                    {title.length} characters
                  </div>
                </div>

                {/* Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Category
                      <span className="text-rose-500"> *</span>
                    </label>

                    <select
                      value={selectedCatId}
                      onChange={e => {
                        setSelectedCatId(e.target.value);
                        setSelectedSubCatName('');
                      }}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 cursor-pointer"
                      required
                    >
                      <option value="">
                        Select category
                      </option>

                      {categories.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Subtopic
                      <span className="text-rose-500"> *</span>
                    </label>

                    <select
                      value={selectedSubCatName}
                      onChange={e =>
                        setSelectedSubCatName(e.target.value)
                      }
                      disabled={!selectedCatId}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 cursor-pointer disabled:bg-slate-50 disabled:text-slate-400"
                      required
                    >
                      <option value="">
                        Select subtopic
                      </option>

                      {availableSubCategories.map(sub => (
                        <option key={sub.id} value={sub.name}>
                          {sub.name}
                        </option>
                      ))}
                    </select>

                    {selectedCatId &&
                      availableSubCategories.length === 0 && (
                        <p className="mt-2 text-xs text-slate-400">
                          No subtopics available. General will be used.
                        </p>
                      )}
                  </div>

                </div>

                {/* Summary */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Short summary
                  </label>

                  <textarea
                    value={summary}
                    onChange={e => setSummary(e.target.value)}
                    rows="3"
                    placeholder="Give readers a short introduction to this content..."
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-800">
                      {contentType === 'ARTICLE'
                        ? 'Article content'
                        : 'Description'}
                      {contentType === 'ARTICLE' && (
                        <span className="text-rose-500"> *</span>
                      )}
                    </label>

                    <span className="text-[11px] text-slate-400">
                      {content.length} characters
                    </span>
                  </div>

                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows="15"
                    placeholder={
                      contentType === 'ARTICLE'
                        ? 'Start writing your article here...'
                        : 'Add more information about the event...'
                    }
                    className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-4 text-sm leading-7 text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 font-sans"
                    required={contentType === 'ARTICLE'}
                  />
                </div>

              </div>

              {/* =====================================================
                  PUBLISH SETTINGS
              ====================================================== */}
              <aside className="lg:col-span-1">

                <div className="lg:sticky lg:top-6 space-y-5">

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                    <div className="flex items-center gap-2 mb-5">
                      <ImageIcon size={17} className="text-slate-600" />

                      <h3 className="text-sm font-bold text-slate-900">
                        Publishing details
                      </h3>
                    </div>

                    {/* Cover */}
                    <div className="mb-5">
                      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
                        Cover image
                      </label>

                      <input
                        type="url"
                        value={coverImageUrl}
                        onChange={e =>
                          setCoverImageUrl(e.target.value)
                        }
                        placeholder="Paste image URL"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                      />

                      {coverImageUrl && (
                        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
                          <img
                            src={coverImageUrl}
                            alt="Cover preview"
                            className="h-32 w-full object-cover"
                            onError={e => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Event details */}
                    {contentType === 'EVENT' && (
                      <div className="space-y-4 border-t border-slate-200 pt-5">

                        <div>
                          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
                            <Calendar size={13} />
                            Event date
                          </label>

                          <input
                            type="date"
                            value={eventDate}
                            onChange={e =>
                              setEventDate(e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                            required
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
                            <Clock3 size={13} />
                            Event time
                          </label>

                          <input
                            type="text"
                            value={eventTime}
                            onChange={e =>
                              setEventTime(e.target.value)
                            }
                            placeholder="09:00 AM"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
                            <MapPin size={13} />
                            Location
                          </label>

                          <input
                            type="text"
                            value={location}
                            onChange={e =>
                              setLocation(e.target.value)
                            }
                            placeholder="Event venue"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">
                            Registration link
                          </label>

                          <input
                            type="url"
                            value={registrationUrl}
                            onChange={e =>
                              setRegistrationUrl(e.target.value)
                            }
                            placeholder="https://..."
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                          />
                        </div>

                      </div>
                    )}

                  </div>

                  {/* Publish box */}
                  <div className="rounded-xl border border-slate-200 bg-white p-5">

                    <p className="text-xs text-slate-500 leading-5 mb-4">
                      Your content will be published immediately and
                      become available to readers.
                    </p>

                    <button
                      type="submit"
                      disabled={isPublishing}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isPublishing ? (
                        <>
                          <Loader2
                            size={17}
                            className="animate-spin"
                          />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <PenSquare size={17} />
                          {contentType === 'ARTICLE'
                            ? 'Publish Article'
                            : 'Publish Event'}
                        </>
                      )}
                    </button>

                  </div>

                </div>

              </aside>

            </form>

          </div>
        </section>
      )}

      {/* =========================================================
          MY ARTICLES
      ========================================================== */}
      {activeTab === 'articles' && (
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-6 border-b border-slate-200">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                My Articles
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Articles you have published.
              </p>
            </div>

            {isAuthenticated && (
              <button
                onClick={fetchMyArticles}
                disabled={loadingArticles}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                <RefreshCw
                  size={14}
                  className={loadingArticles ? 'animate-spin' : ''}
                />
                Refresh
              </button>
            )}

          </div>

          <div className="p-6">

            {loadingArticles ? (
              <div className="py-16 flex flex-col items-center justify-center text-slate-500 gap-3">
                <Loader2
                  size={26}
                  className="animate-spin text-blue-600"
                />
                <span className="text-sm">
                  Loading your articles...
                </span>
              </div>
            ) : articlesError ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                <div className="flex items-center gap-2">
                  <AlertCircle size={17} />
                  {articlesError}
                </div>
              </div>
            ) : myArticles.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

                {myArticles.map(blog => (
                  <article
                    key={blog.id}
                    className="group overflow-hidden rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition"
                  >

                    <div className="flex">

                      <div className="hidden sm:block w-28 shrink-0 bg-slate-100">
                        {blog.coverImageUrl ? (
                          <img
                            src={blog.coverImageUrl}
                            alt=""
                            className="h-full min-h-[150px] w-full object-cover"
                          />
                        ) : (
                          <div className="h-full min-h-[150px] flex items-center justify-center text-slate-300">
                            <FileText size={28} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 p-5">

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0">
                            <h3 className="text-base font-bold text-slate-900 leading-6 group-hover:text-blue-700 transition">
                              {blog.title}
                            </h3>

                            <p className="mt-2 text-xs leading-5 text-slate-500">
                              {blog.summary ||
                                'Published article'}
                            </p>
                          </div>

                          <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                            {blog.status}
                          </span>

                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-slate-500">

                          <span>
                            {blog.category?.name ||
                              'General'}
                          </span>

                          <span>•</span>

                          <span>
                            {blog.subCategoryName ||
                              'General'}
                          </span>

                          <span>•</span>

                          <span>
                            {formatDate(blog.createdAt)}
                          </span>

                          <span>•</span>

                          <span>
                            {calculateReadTime(blog.content)}
                          </span>

                        </div>

                        <div className="mt-5 flex items-center justify-between">

                          <div className="flex items-center gap-4 text-xs text-slate-500">

                            <span className="inline-flex items-center gap-1">
                              <Heart size={13} />
                              {blog.likesCount || 0}
                            </span>

                            <span className="inline-flex items-center gap-1">
                              <MessageSquare size={13} />
                              {blog.commentsCount || 0}
                            </span>

                          </div>

                          <Link
                            to={`/blog/${blog.slug || blog.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                          >
                            View
                            <ExternalLink size={12} />
                          </Link>

                        </div>

                      </div>

                    </div>

                  </article>
                ))}

              </div>
            ) : (
              <div className="py-16 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50">

                <FileText
                  size={38}
                  className="mx-auto text-slate-300 mb-3"
                />

                <h3 className="text-sm font-bold text-slate-800">
                  No published articles yet
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Start writing your first article.
                </p>

                <button
                  onClick={() => setActiveTab('create')}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
                >
                  <PlusCircle size={14} />
                  Write an Article
                </button>

              </div>
            )}

          </div>
        </section>
      )}

      {/* =========================================================
          MY EVENTS
      ========================================================== */}
      {activeTab === 'events' && (
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="px-6 py-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              My Events
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upcoming events you have created.
            </p>
          </div>

          <div className="p-6">

            {loadingEvents ? (
              <div className="py-16 flex flex-col items-center justify-center text-slate-500 gap-3">
                <Loader2
                  size={26}
                  className="animate-spin text-blue-600"
                />

                <span className="text-sm">
                  Loading events...
                </span>
              </div>
            ) : myEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {myEvents.map(ev => (
                  <article
                    key={ev.id}
                    className="rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 mb-3">
                          <Calendar size={14} />
                          Upcoming event
                        </div>

                        <h3 className="text-base font-bold text-slate-900">
                          {ev.title}
                        </h3>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-700">
                        {ev.status}
                      </span>

                    </div>

                    <div className="mt-5 space-y-2 text-xs text-slate-500">

                      <p>
                        <span className="font-semibold text-slate-700">
                          Category:
                        </span>{' '}
                        {ev.categoryName} →{' '}
                        {ev.subCategoryName}
                      </p>

                      <p>
                        <span className="font-semibold text-slate-700">
                          Date:
                        </span>{' '}
                        {ev.eventDate}
                      </p>

                      <p className="flex items-center gap-1.5">
                        <MapPin size={13} />
                        {ev.location}
                      </p>

                    </div>

                  </article>
                ))}

              </div>
            ) : (
              <div className="py-16 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50">

                <Calendar
                  size={38}
                  className="mx-auto text-slate-300 mb-3"
                />

                <h3 className="text-sm font-bold text-slate-800">
                  No upcoming events
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Create an event from the Create tab.
                </p>

                <button
                  onClick={() => setActiveTab('create')}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
                >
                  <PlusCircle size={14} />
                  Create Event
                </button>

              </div>
            )}

          </div>
        </section>
      )}

    </div>
  );
};

export default AuthorDashboardPage;