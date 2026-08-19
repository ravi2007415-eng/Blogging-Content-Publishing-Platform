import React, { useState, useContext } from 'react';
import { CategoryContext } from '../context/CategoryContext';
import { NotificationContext } from '../context/NotificationContext';
import { MOCK_BLOGS, MOCK_EVENTS } from '../mockData';
import { 
  Shield, Layers, Users, FileText, Calendar, Plus, Trash2, Edit3, 
  Send, Sparkles, CheckCircle2, AlertCircle, ShieldAlert, Award 
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { categories, addCategory, addSubCategory, deleteCategory, deleteSubCategory } = useContext(CategoryContext);
  const { broadcastAnnouncement } = useContext(NotificationContext);

  const [activeTab, setActiveTab] = useState('categories'); // 'categories', 'users', 'content', 'broadcast'
  
  // New Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // New Sub-Category Form State
  const [selectedParentId, setSelectedParentId] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubDesc, setNewSubDesc] = useState('');

  // Broadcast Message Form State
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState('');

  // User Management State
  const [userList, setUserList] = useState([
    { id: 1, name: 'Alex Rivera', email: 'alex@keryx.dev', role: 'ROLE_AUTHOR', articles: 12, status: 'ACTIVE' },
    { id: 2, name: 'Elena Vance', email: 'admin@keryx.dev', role: 'ROLE_ADMIN', articles: 4, status: 'ACTIVE' },
    { id: 3, name: 'Sarah Connor', email: 'reader@keryx.dev', role: 'ROLE_USER', articles: 0, status: 'ACTIVE' },
    { id: 4, name: 'Marcus Vance', email: 'marcus@keryx.dev', role: 'ROLE_AUTHOR', articles: 8, status: 'ACTIVE' },
  ]);

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({ name: newCatName.trim(), description: newCatDesc.trim() });
    setNewCatName('');
    setNewCatDesc('');
  };

  const handleCreateSubCategory = (e) => {
    e.preventDefault();
    if (!selectedParentId || !newSubName.trim()) return;
    addSubCategory(Number(selectedParentId), { name: newSubName.trim(), description: newSubDesc.trim() });
    setNewSubName('');
    setNewSubDesc('');
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    broadcastAnnouncement(broadcastText.trim());
    setBroadcastSuccess('Real-time announcement broadcasted to all active user sessions!');
    setBroadcastText('');
    setTimeout(() => setBroadcastSuccess(''), 4000);
  };

  const toggleUserRole = (userId) => {
    setUserList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextRole = u.role === 'ROLE_USER' ? 'ROLE_AUTHOR' : u.role === 'ROLE_AUTHOR' ? 'ROLE_ADMIN' : 'ROLE_USER';
        return { ...u, role: nextRole };
      }
      return u;
    }));
  };

  return (
    <div className="page-container admin-dashboard-page">
      
      {/* Admin Header */}
      <div className="admin-hero-panel glass-panel mb-6">
        <div className="admin-hero-header">
          <div className="admin-badge">
            <Shield size={16} className="text-pink animate-pulse" />
            <span>Admin Command Center</span>
          </div>
          <h1 className="hero-title">Platform Taxonomy & Moderation</h1>
          <p className="hero-subtitle text-muted">
            Manage dynamic categories, sub-categories, user roles, content moderation, and dispatch real-time broadcast announcements.
          </p>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="admin-tabs-bar glass-panel mb-6">
        <button
          className={`admin-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <Layers size={18} />
          <span>Category & Sub-Category Manager</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} />
          <span>Users & Authors ({userList.length})</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          <FileText size={18} />
          <span>Content & Events</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'broadcast' ? 'active' : ''}`}
          onClick={() => setActiveTab('broadcast')}
        >
          <Send size={18} />
          <span>Real-time Broadcast</span>
        </button>
      </div>

      {/* TAB 1: CATEGORY & SUB-CATEGORY MANAGER */}
      {activeTab === 'categories' && (
        <div className="admin-tab-content grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Create Category & Sub-Category Forms */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Form 1: Add Main Category */}
            <div className="admin-card glass-panel">
              <h3 className="card-title flex items-center gap-2 mb-4">
                <Plus size={18} className="text-cyan" />
                <span>Add Main Category</span>
              </h3>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Esports, Science..."
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    className="input-field"
                    rows="2"
                    placeholder="Brief description of the category..."
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  Create Main Category
                </button>
              </form>
            </div>

            {/* Form 2: Add Sub-Category */}
            <div className="admin-card glass-panel">
              <h3 className="card-title flex items-center gap-2 mb-4">
                <Plus size={18} className="text-pink" />
                <span>Add Sub-Category</span>
              </h3>
              <form onSubmit={handleCreateSubCategory} className="space-y-4">
                <div>
                  <label className="form-label">Parent Main Category</label>
                  <select
                    className="input-field"
                    value={selectedParentId}
                    onChange={(e) => setSelectedParentId(e.target.value)}
                    required
                  >
                    <option value="">Select Parent Category...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Sub-Category Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Volleyball, AI & ML, Stand-up..."
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    className="input-field"
                    rows="2"
                    placeholder="Sub-category description..."
                    value={newSubDesc}
                    onChange={(e) => setNewSubDesc(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  Add Sub-Category
                </button>
              </form>
            </div>

          </div>

          {/* Active Categories Tree View */}
          <div className="lg:col-span-2">
            <div className="admin-card glass-panel">
              <h3 className="card-title mb-4 flex justify-between items-center">
                <span>Active Category & Sub-Category Tree</span>
                <span className="badge badge-cyan">{categories.length} Main Categories</span>
              </h3>

              <div className="categories-tree-list space-y-4">
                {categories.map(cat => (
                  <div key={cat.id} className="category-tree-node glass-panel p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-lg text-gradient flex items-center gap-2">
                          <span>{cat.name}</span>
                          <span className="text-xs text-muted font-normal">(/category/{cat.slug})</span>
                        </h4>
                        <p className="text-xs text-muted mt-1">{cat.description}</p>
                      </div>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="btn-icon text-muted hover:text-red-400"
                        title="Delete Category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Sub-categories List */}
                    <div className="subcategories-chip-grid mt-3 flex flex-wrap gap-2 pt-3 border-t border-glass">
                      <span className="text-xs font-semibold text-pink self-center mr-1">Sub-Categories:</span>
                      {(cat.subCategories || []).length === 0 ? (
                        <span className="text-xs text-muted italic">No sub-categories yet.</span>
                      ) : (
                        cat.subCategories.map(sub => (
                          <div key={sub.id} className="subcat-badge-item">
                            <span>{sub.name}</span>
                            <button
                              onClick={() => deleteSubCategory(cat.id, sub.id)}
                              className="subcat-del-btn"
                              title="Remove Sub-Category"
                            >
                              ×
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 2: USERS & AUTHORS MANAGER */}
      {activeTab === 'users' && (
        <div className="admin-card glass-panel">
          <h3 className="card-title mb-4">Manage Platform Users & Roles</h3>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Current Role</th>
                  <th>Articles</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userList.map(u => (
                  <tr key={u.id}>
                    <td className="font-semibold">{u.name}</td>
                    <td className="text-muted">{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'badge-pink' : u.role === 'ROLE_AUTHOR' ? 'badge-cyan' : 'badge-secondary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.articles}</td>
                    <td><span className="badge badge-success">{u.status}</span></td>
                    <td>
                      <button
                        onClick={() => toggleUserRole(u.id)}
                        className="btn btn-xs btn-outline"
                      >
                        Toggle Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CONTENT & EVENTS MODERATION */}
      {activeTab === 'content' && (
        <div className="admin-card glass-panel space-y-6">
          <div>
            <h3 className="card-title mb-3">Published Articles Moderation ({MOCK_BLOGS.length})</h3>
            <div className="space-y-3">
              {MOCK_BLOGS.map(blog => (
                <div key={blog.id} className="p-3 glass-panel flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">{blog.title}</h4>
                    <p className="text-xs text-muted">{blog.category?.name} → {blog.subCategoryName || 'General'} | By {blog.author?.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="badge badge-success">PUBLISHED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="card-title mb-3">Upcoming Events Moderation ({MOCK_EVENTS.length})</h3>
            <div className="space-y-3">
              {MOCK_EVENTS.map(event => (
                <div key={event.id} className="p-3 glass-panel flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">{event.title}</h4>
                    <p className="text-xs text-muted">{event.categoryName} → {event.subCategoryName} | {event.eventDate} @ {event.location}</p>
                  </div>
                  <span className="badge badge-pink">{event.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REAL-TIME BROADCAST */}
      {activeTab === 'broadcast' && (
        <div className="admin-card glass-panel max-w-2xl mx-auto">
          <h3 className="card-title flex items-center gap-2 mb-2">
            <Send size={20} className="text-pink" />
            <span>Dispatch Real-Time Broadcast Alert</span>
          </h3>
          <p className="text-sm text-muted mb-4">
            Send an instant notification popup to all active users viewing the Keryx platform.
          </p>

          {broadcastSuccess && (
            <div className="p-3 mb-4 rounded-lg bg-green-500/20 border border-green-500/40 text-green-300 text-sm flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{broadcastSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="form-label">Broadcast Message</label>
              <textarea
                className="input-field"
                rows="4"
                placeholder="e.g. Breaking Update: Live finals starting now in Volleyball section..."
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full flex justify-center items-center gap-2">
              <Send size={16} />
              <span>Broadcast Alert Now</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
