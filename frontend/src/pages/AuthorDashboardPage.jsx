import React, { useState, useContext } from 'react';
import { CategoryContext } from '../context/CategoryContext';
import { NotificationContext } from '../context/NotificationContext';
import { MOCK_BLOGS, MOCK_EVENTS } from '../mockData';
import { 
  PenSquare, FileText, Calendar, PlusCircle, Sparkles, CheckCircle2, 
  Heart, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuthorDashboardPage = () => {
  const { categories } = useContext(CategoryContext);
  const { broadcastPost, broadcastEvent } = useContext(NotificationContext);

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

  const [publishSuccess, setPublishSuccess] = useState('');

  const currentSelectedCategory = categories.find(c => String(c.id) === String(selectedCatId) || c.slug === selectedCatId);
  const availableSubCategories = currentSelectedCategory ? (currentSelectedCategory.subCategories || []) : [];

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title.trim() || !selectedCatId) return;

    const categoryObj = currentSelectedCategory || { name: 'General', slug: 'general' };

    if (contentType === 'ARTICLE') {
      const newPost = {
        id: Date.now(),
        title: title.trim(),
        slug: title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
        summary: summary.trim(),
        content: content.trim(),
        coverImage: coverImageUrl.trim() || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
        category: categoryObj,
        subCategoryName: selectedSubCatName || availableSubCategories[0]?.name || 'General',
        author: { name: 'Alex Rivera', email: 'alex@keryx.dev' },
        createdAt: new Date().toISOString()
      };

      broadcastPost(newPost);
      setPublishSuccess(`Article "${newPost.title}" published under ${categoryObj.name} → ${newPost.subCategoryName}!`);
    } else {
      const newEvent = {
        id: Date.now(),
        title: title.trim(),
        description: summary.trim() || content.trim(),
        categoryName: categoryObj.name,
        subCategoryName: selectedSubCatName || availableSubCategories[0]?.name || 'General',
        eventDate: eventDate || '2026-09-15',
        eventTime: eventTime || '10:00 AM PST',
        location: location.trim() || 'Main Campus Center',
        registrationUrl: registrationUrl.trim() || 'https://example.com/register',
        status: 'UPCOMING',
        organizer: 'Alex Rivera',
        coverImageUrl: coverImageUrl.trim() || 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80',
        createdAt: new Date().toISOString()
      };

      broadcastEvent(newEvent);
      setPublishSuccess(`Upcoming Event "${newEvent.title}" scheduled for ${newEvent.eventDate} under ${categoryObj.name} → ${newEvent.subCategoryName}!`);
    }

    // Reset Form
    setTitle('');
    setSummary('');
    setContent('');
    setCoverImageUrl('');
    setEventDate('');
    setEventTime('');
    setLocation('');
    setRegistrationUrl('');
    setTimeout(() => setPublishSuccess(''), 5000);
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
          <span>My Articles ({MOCK_BLOGS.length})</span>
        </button>

        <button
          className={`pill-btn text-xs inline-flex items-center gap-1.5 ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <Calendar size={14} />
          <span>My Events ({MOCK_EVENTS.length})</span>
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

          {publishSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>{publishSuccess}</span>
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

            <button type="submit" className="btn btn-primary btn-pill w-full py-3 flex items-center justify-center gap-2 font-semibold">
              <Sparkles size={18} />
              <span>Publish & Broadcast Live Update</span>
            </button>

          </form>

        </div>
      )}

      {/* TAB 2: MY ARTICLES */}
      {activeTab === 'articles' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-4">My Published Articles ({MOCK_BLOGS.length})</h3>
          <div className="space-y-3">
            {MOCK_BLOGS.map(blog => (
              <div key={blog.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300 transition flex justify-between items-center gap-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">{blog.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Channel: <span className="text-blue-600 font-semibold">{blog.category?.name} → {blog.subCategoryName}</span> | {blog.readTime}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 shrink-0">
                  <span className="flex items-center gap-1"><Heart size={13} className="text-rose-500" /> {blog.likesCount}</span>
                  <span className="flex items-center gap-1"><MessageSquare size={13} className="text-blue-500" /> {blog.commentsCount}</span>
                  <Link to={`/blog/${blog.slug}`} className="btn btn-xs btn-outline">View</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MY EVENTS */}
      {activeTab === 'events' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-4">My Scheduled Events ({MOCK_EVENTS.length})</h3>
          <div className="space-y-3">
            {MOCK_EVENTS.map(ev => (
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
        </div>
      )}

    </div>
  );
};

export default AuthorDashboardPage;
