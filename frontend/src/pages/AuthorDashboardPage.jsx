import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CategoryContext } from '../context/CategoryContext';
import { NotificationContext } from '../context/NotificationContext';
import { blogApi } from '../api/blogApi';
import { eventApi } from '../api/eventApi';
import { 
  PenSquare, FileText, Calendar, PlusCircle, Sparkles, CheckCircle2, 
  Trash2, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuthorDashboardPage = () => {
  const { user } = useContext(AuthContext);
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
  const [status, setStatus] = useState('PUBLISHED'); // DRAFT or PUBLISHED

  // Event State
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('');

  const [myBlogs, setMyBlogs] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const currentSelectedCategory = categories.find(c => String(c.id) === String(selectedCatId) || String(c.slug) === String(selectedCatId));
  const availableSubCategories = currentSelectedCategory ? (currentSelectedCategory.subCategories || []) : [];

  const loadAuthorData = async () => {
    setLoading(true);
    try {
      if (user) {
        const blogs = await blogApi.getMyBlogs();
        setMyBlogs(Array.isArray(blogs) ? blogs : []);
      }
      const events = await eventApi.getEvents();
      setMyEvents(Array.isArray(events) ? events : []);
    } catch (err) {
      console.error('Failed to load author dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthorData();
  }, [user]);

  const handlePublish = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setPublishSuccess('');

    if (!title.trim() || !selectedCatId) {
      setErrorMessage('Please fill in required fields (Title and Category).');
      return;
    }

    try {
      const categoryIdNum = Number(selectedCatId) || currentSelectedCategory?.id || 1;

      if (contentType === 'ARTICLE') {
        const blogData = {
          title: title.trim(),
          summary: summary.trim(),
          content: content.trim(),
          coverImageUrl: coverImageUrl.trim(),
          categoryId: categoryIdNum,
          subCategoryName: selectedSubCatName || (availableSubCategories[0]?.name || ''),
          status: status
        };

        const savedBlog = await blogApi.createBlog(blogData);
        broadcastPost({
          id: savedBlog.id,
          title: savedBlog.title,
          slug: savedBlog.slug,
          summary: savedBlog.summary,
          category: savedBlog.category,
          subCategoryName: savedBlog.subCategoryName
        });

        setPublishSuccess(`Article "${savedBlog.title}" successfully saved to MySQL database (${savedBlog.status})!`);
      } else {
        const eventPayload = {
          title: title.trim(),
          description: summary.trim() || content.trim(),
          categoryName: currentSelectedCategory?.name || 'General',
          subCategoryName: selectedSubCatName || 'General',
          eventDate: eventDate || '2026-09-15',
          eventTime: eventTime || '10:00 AM',
          location: location.trim() || 'Main Campus Hall',
          registrationUrl: registrationUrl.trim() || '',
          status: 'UPCOMING',
          organizer: user?.fullName || user?.username || 'Author',
          coverImageUrl: coverImageUrl.trim()
        };

        const savedEvent = await eventApi.createEvent(eventPayload);
        broadcastEvent(savedEvent);
        setPublishSuccess(`Upcoming Event "${savedEvent.title}" successfully created and saved in MySQL!`);
      }

      // Reset form
      setTitle('');
      setSummary('');
      setContent('');
      setCoverImageUrl('');
      setEventDate('');
      setEventTime('');
      setLocation('');
      setRegistrationUrl('');
      loadAuthorData();
    } catch (err) {
      console.error('Failed to create content in MySQL:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to save to database. Please verify backend state.');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article from MySQL?')) return;
    try {
      await blogApi.deleteBlog(id);
      loadAuthorData();
    } catch (err) {
      alert('Failed to delete blog.');
    }
  };

  return (
    <div className="page-container author-dashboard space-y-6">
      
      {/* Studio Header */}
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
            <PenSquare size={14} />
            <span>Author & Editorial Studio</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
            Content Publishing Center
          </h1>
          <p className="text-xs text-gray-500 font-serif">
            Authenticated Creator: <strong>{user?.fullName || user?.username}</strong> ({user?.email})
          </p>
        </div>

        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition ${activeTab === 'create' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveTab('create')}
          >
            <PlusCircle size={14} /> New Story
          </button>
          <button
            className={`px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition ${activeTab === 'articles' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveTab('articles')}
          >
            <FileText size={14} /> My Articles ({myBlogs.length})
          </button>
          <button
            className={`px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition ${activeTab === 'events' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveTab('events')}
          >
            <Calendar size={14} /> My Events ({myEvents.length})
          </button>
        </div>
      </div>

      {/* CREATE TAB */}
      {activeTab === 'create' && (
        <div className="bg-white p-6 rounded border border-gray-200 max-w-4xl mx-auto space-y-6">
          
          <div className="flex border-b border-gray-200 pb-4 gap-4">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-semibold rounded border text-center transition ${contentType === 'ARTICLE' ? 'bg-blue-900 text-white border-blue-900' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
              onClick={() => setContentType('ARTICLE')}
            >
              Article / Editorial Story
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-semibold rounded border text-center transition ${contentType === 'EVENT' ? 'bg-blue-900 text-white border-blue-900' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
              onClick={() => setContentType('EVENT')}
            >
              Upcoming Event
            </button>
          </div>

          {publishSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded text-sm flex items-center gap-2 font-serif">
              <CheckCircle2 size={18} />
              <span>{publishSuccess}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded text-sm font-serif">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-4 text-left">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                {contentType === 'ARTICLE' ? 'Story Title' : 'Event Title'} *
              </label>
              <input
                type="text"
                className="input-field text-base font-serif"
                placeholder={contentType === 'ARTICLE' ? 'Enter headline title...' : 'Enter event title...'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Category & Subcategory Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Main Category *</label>
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Subcategory *</label>
                <select
                  className="input-field"
                  value={selectedSubCatName}
                  onChange={(e) => setSelectedSubCatName(e.target.value)}
                  disabled={!selectedCatId}
                  required
                >
                  <option value="">Select Subcategory...</option>
                  {availableSubCategories.map(sub => (
                    <option key={sub.id} value={sub.name}>{sub.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Event Specific Inputs */}
            {contentType === 'EVENT' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded border border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Date *</label>
                  <input type="date" className="input-field" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Time</label>
                  <input type="text" className="input-field" placeholder="e.g. 06:00 PM IST" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Location *</label>
                  <input type="text" className="input-field" placeholder="e.g. Sports Complex, Mumbai" value={location} onChange={(e) => setLocation(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Registration Link</label>
                  <input type="url" className="input-field" placeholder="https://..." value={registrationUrl} onChange={(e) => setRegistrationUrl(e.target.value)} />
                </div>
              </div>
            )}

            {/* Image URL & Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Cover Image URL</label>
                <input type="url" className="input-field" placeholder="https://..." value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} />
              </div>
              {contentType === 'ARTICLE' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Status</label>
                  <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Summary</label>
              <input type="text" className="input-field" placeholder="Brief excerpt summary..." value={summary} onChange={(e) => setSummary(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Content Body *</label>
              <textarea className="input-field font-serif text-sm" rows="8" placeholder="Write full article body..." value={content} onChange={(e) => setContent(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-primary text-sm w-full py-3">
              <Sparkles size={16} /> Save & Persist to MySQL
            </button>
          </form>

        </div>
      )}

      {/* ARTICLES TAB */}
      {activeTab === 'articles' && (
        <div className="bg-white p-6 rounded border border-gray-200">
          <h3 className="font-serif text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            My Database Articles ({myBlogs.length})
          </h3>
          {myBlogs.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No published or draft articles found in MySQL.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {myBlogs.map(blog => (
                <div key={blog.id} className="py-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-serif font-bold text-gray-900 text-base">{blog.title}</h4>
                    <span className="text-xs text-gray-500">
                      {blog.category?.name} → {blog.subCategoryName || 'General'} | Status: <strong>{blog.status}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/blog/${blog.slug}`} className="btn btn-secondary text-xs">
                      <Eye size={12} /> Read
                    </Link>
                    <button onClick={() => handleDeleteBlog(blog.id)} className="btn btn-danger text-xs">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* EVENTS TAB */}
      {activeTab === 'events' && (
        <div className="bg-white p-6 rounded border border-gray-200">
          <h3 className="font-serif text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Scheduled Events in MySQL ({myEvents.length})
          </h3>
          {myEvents.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No scheduled events in MySQL.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {myEvents.map(ev => (
                <div key={ev.id} className="py-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-serif font-bold text-gray-900">{ev.title}</h4>
                    <span className="text-xs text-gray-500">
                      {ev.categoryName} → {ev.subCategoryName} | Date: {ev.eventDate} ({ev.location})
                    </span>
                  </div>
                  <span className="badge badge-primary">{ev.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default AuthorDashboardPage;
