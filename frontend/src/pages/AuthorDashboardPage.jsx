import React, { useState, useContext } from 'react';
import { CategoryContext } from '../context/CategoryContext';
import { NotificationContext } from '../context/NotificationContext';
import { MOCK_BLOGS, MOCK_EVENTS } from '../mockData';
import { 
  PenSquare, FileText, Calendar, PlusCircle, Sparkles, CheckCircle2, 
  Eye, Heart, MessageSquare, Clock, ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuthorDashboardPage = () => {
  const { categories } = useContext(CategoryContext);
  const { broadcastPost, broadcastEvent } = useContext(NotificationContext);

  const [activeTab, setActiveTab] = useState('create'); // 'create', 'articles', 'events', 'analytics'
  const [contentType, setContentType] = useState('ARTICLE'); // 'ARTICLE' or 'EVENT'

  // Common Form State
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

  // Get current selected main category object
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
    <div className="page-container author-dashboard-page">
      
      {/* Hero Header */}
      <div className="author-hero-panel glass-panel mb-6">
        <div className="author-hero-header">
          <div className="author-badge">
            <PenSquare size={16} className="text-cyan animate-pulse" />
            <span>Author & Creator Studio</span>
          </div>
          <h1 className="hero-title">Publish Articles & Upcoming Events</h1>
          <p className="hero-subtitle text-muted">
            Create high-impact content, target main categories and sub-categories, and trigger real-time notifications for readers.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="author-tabs-bar glass-panel mb-6">
        <button
          className={`author-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <PlusCircle size={18} />
          <span>Publish New Content</span>
        </button>

        <button
          className={`author-tab-btn ${activeTab === 'articles' ? 'active' : ''}`}
          onClick={() => setActiveTab('articles')}
        >
          <FileText size={18} />
          <span>My Articles ({MOCK_BLOGS.length})</span>
        </button>

        <button
          className={`author-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <Calendar size={18} />
          <span>My Events ({MOCK_EVENTS.length})</span>
        </button>
      </div>

      {/* TAB 1: CREATE / PUBLISH CONTENT FORM */}
      {activeTab === 'create' && (
        <div className="author-card glass-panel max-w-4xl mx-auto">
          
          <div className="form-type-selector flex gap-4 mb-6 p-1 glass-panel rounded-xl">
            <button
              type="button"
              className={`type-btn flex-1 py-3 font-semibold rounded-lg flex items-center justify-center gap-2 transition ${contentType === 'ARTICLE' ? 'bg-primary text-white shadow-lg' : 'text-muted hover:text-white'}`}
              onClick={() => setContentType('ARTICLE')}
            >
              <FileText size={18} />
              <span>Publish Article / Blog</span>
            </button>

            <button
              type="button"
              className={`type-btn flex-1 py-3 font-semibold rounded-lg flex items-center justify-center gap-2 transition ${contentType === 'EVENT' ? 'bg-pink text-white shadow-lg' : 'text-muted hover:text-white'}`}
              onClick={() => setContentType('EVENT')}
            >
              <Calendar size={18} />
              <span>Publish Upcoming Event</span>
            </button>
          </div>

          {publishSuccess && (
            <div className="p-4 mb-6 rounded-xl bg-green-500/20 border border-green-500/40 text-green-300 flex items-center gap-3">
              <CheckCircle2 size={20} />
              <span>{publishSuccess}</span>
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="form-label font-bold text-sm">
                {contentType === 'ARTICLE' ? 'Article Title' : 'Event Name'} *
              </label>
              <input
                type="text"
                className="input-field text-lg"
                placeholder={contentType === 'ARTICLE' ? 'e.g. Upcoming Volleyball Tournament Next Month...' : 'e.g. Inter-State Volleyball Championship 2026...'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Hierarchical Category & Sub-Category Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Main Category */}
              <div>
                <label className="form-label font-bold text-sm">Main Category *</label>
                <select
                  className="input-field"
                  value={selectedCatId}
                  onChange={(e) => {
                    setSelectedCatId(e.target.value);
                    setSelectedSubCatName('');
                  }}
                  required
                >
                  <option value="">Select Main Category...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Sub-Category */}
              <div>
                <label className="form-label font-bold text-sm">Sub-Category *</label>
                <select
                  className="input-field"
                  value={selectedSubCatName}
                  onChange={(e) => setSelectedSubCatName(e.target.value)}
                  disabled={!selectedCatId}
                  required
                >
                  <option value="">Select Sub-Category...</option>
                  {availableSubCategories.map(sub => (
                    <option key={sub.id} value={sub.name}>{sub.name}</option>
                  ))}
                </select>
                {selectedCatId && availableSubCategories.length === 0 && (
                  <p className="text-xs text-muted mt-1 italic">No sub-categories defined. General will be used.</p>
                )}
              </div>

            </div>

            {/* Event Specific Inputs */}
            {contentType === 'EVENT' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl glass-panel border border-pink-500/30">
                <div>
                  <label className="form-label">Event Date *</label>
                  <input
                    type="date"
                    className="input-field"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Event Time</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 09:00 AM PST"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Location / Venue *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Pacific Sports Arena, San Francisco, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Registration / Ticket Link</label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://example.com/register"
                    value={registrationUrl}
                    onChange={(e) => setRegistrationUrl(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Cover Image URL */}
            <div>
              <label className="form-label">Cover Image URL</label>
              <input
                type="url"
                className="input-field"
                placeholder="https://images.unsplash.com/..."
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
              />
            </div>

            {/* Summary / Excerpt */}
            <div>
              <label className="form-label">Summary / Excerpt</label>
              <input
                type="text"
                className="input-field"
                placeholder="Short 1-2 sentence teaser summary..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>

            {/* Main Content Body */}
            <div>
              <label className="form-label">Main Content Body *</label>
              <textarea
                className="input-field font-mono text-sm"
                rows="8"
                placeholder="Write article details using Markdown or plain text..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2">
              <Sparkles size={18} />
              <span>Publish & Broadcast Live Update</span>
            </button>

          </form>

        </div>
      )}

      {/* TAB 2: MY ARTICLES */}
      {activeTab === 'articles' && (
        <div className="author-card glass-panel">
          <h3 className="card-title mb-4">My Published Articles ({MOCK_BLOGS.length})</h3>
          <div className="space-y-4">
            {MOCK_BLOGS.map(blog => (
              <div key={blog.id} className="p-4 glass-panel flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-base">{blog.title}</h4>
                  <p className="text-xs text-muted mt-1">
                    Category: <span className="text-cyan font-semibold">{blog.category?.name} → {blog.subCategoryName}</span> | {blog.readTime}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1"><Heart size={14} className="text-pink" /> {blog.likesCount}</span>
                  <span className="flex items-center gap-1"><MessageSquare size={14} className="text-cyan" /> {blog.commentsCount}</span>
                  <Link to={`/blog/${blog.slug}`} className="btn btn-xs btn-outline">View</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MY EVENTS */}
      {activeTab === 'events' && (
        <div className="author-card glass-panel">
          <h3 className="card-title mb-4">My Scheduled Events ({MOCK_EVENTS.length})</h3>
          <div className="space-y-4">
            {MOCK_EVENTS.map(ev => (
              <div key={ev.id} className="p-4 glass-panel flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-base">{ev.title}</h4>
                  <p className="text-xs text-muted mt-1">
                    {ev.categoryName} → {ev.subCategoryName} | Date: <span className="text-pink font-semibold">{ev.eventDate}</span> ({ev.location})
                  </p>
                </div>
                <span className="badge badge-success">{ev.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AuthorDashboardPage;
