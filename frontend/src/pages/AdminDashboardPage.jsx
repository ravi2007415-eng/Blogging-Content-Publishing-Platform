import React, { useState, useContext } from 'react';
import { CategoryContext } from '../context/CategoryContext';
import { NotificationContext } from '../context/NotificationContext';
import { MOCK_BLOGS, MOCK_EVENTS } from '../mockData';
import { DashboardLayout } from '../components/DashboardLayout';
import {
  Shield, Layers, Users, FileText, Plus, Trash2, Send, CheckCircle2
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

  const navItems = [
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'users', label: 'Users & Authors', icon: Users, count: userList.length },
    { id: 'content', label: 'Content & Events', icon: FileText },
    { id: 'broadcast', label: 'Broadcast', icon: Send },
  ];

  return (
    <div className="page-container admin-dashboard-page">
      <DashboardLayout
        eyebrow="Admin Command Center"
        title="Platform Taxonomy & Moderation"
        subtitle="Manage dynamic categories, sub-categories, user roles, content moderation, and dispatch real-time broadcast announcements."
        icon={Shield}
        navItems={navItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {/* TAB 1: CATEGORY & SUB-CATEGORY MANAGER */}
        {activeTab === 'categories' && (
          <div className="wpc-grid wpc-grid-2">

            {/* Create Category & Sub-Category Forms */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div className="wpc-card">
                <h3 className="wpc-card-title">
                  <Plus size={16} className="text-blue" />
                  <span>Add Main Category</span>
                </h3>
                <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Create Main Category
                  </button>
                </form>
              </div>

              <div className="wpc-card">
                <h3 className="wpc-card-title">
                  <Plus size={16} className="text-pink-wpc" />
                  <span>Add Sub-Category</span>
                </h3>
                <form onSubmit={handleCreateSubCategory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Add Sub-Category
                  </button>
                </form>
              </div>

            </div>

            {/* Active Categories Tree View */}
            <div className="wpc-card">
              <h3 className="wpc-card-title" style={{ justifyContent: 'space-between' }}>
                <span>Active Category & Sub-Category Tree</span>
                <span className="badge badge-cyan">{categories.length} Main Categories</span>
              </h3>

              <div>
                {categories.map(cat => (
                  <div key={cat.id} className="wpc-row">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }} className="text-heading">
                          <span>{cat.name}</span>
                          <span style={{ fontSize: '11px', fontWeight: 400 }} className="text-muted-wpc">(/category/{cat.slug})</span>
                        </h4>
                        <p style={{ fontSize: '12px', marginTop: '4px' }} className="text-muted-wpc">{cat.description}</p>
                      </div>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="btn-icon"
                        title="Delete Category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--wpc-border)' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, alignSelf: 'center', marginRight: '4px' }} className="text-pink-wpc">Sub-Categories:</span>
                      {(cat.subCategories || []).length === 0 ? (
                        <span style={{ fontSize: '12px', fontStyle: 'italic' }} className="text-muted-wpc">No sub-categories yet.</span>
                      ) : (
                        cat.subCategories.map(sub => (
                          <div key={sub.id} className="wpc-subcat-chip">
                            <span>{sub.name}</span>
                            <button
                              onClick={() => deleteSubCategory(cat.id, sub.id)}
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
        )}

        {/* TAB 2: USERS & AUTHORS MANAGER */}
        {activeTab === 'users' && (
          <div className="wpc-card">
            <h3 className="wpc-card-title">Manage Platform Users & Roles</h3>
            <div style={{ overflowX: 'auto' }}>
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
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td className="text-muted-wpc">{u.email}</td>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="wpc-card">
              <h3 className="wpc-card-title">Published Articles Moderation ({MOCK_BLOGS.length})</h3>
              <div>
                {MOCK_BLOGS.map(blog => (
                  <div key={blog.id} className="wpc-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: '14px' }} className="text-heading">{blog.title}</h4>
                      <p style={{ fontSize: '12px' }} className="text-muted-wpc">{blog.category?.name} → {blog.subCategoryName || 'General'} | By {blog.author?.name}</p>
                    </div>
                    <span className="badge badge-success">PUBLISHED</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="wpc-card">
              <h3 className="wpc-card-title">Upcoming Events Moderation ({MOCK_EVENTS.length})</h3>
              <div>
                {MOCK_EVENTS.map(event => (
                  <div key={event.id} className="wpc-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: '14px' }} className="text-heading">{event.title}</h4>
                      <p style={{ fontSize: '12px' }} className="text-muted-wpc">{event.categoryName} → {event.subCategoryName} | {event.eventDate} @ {event.location}</p>
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
          <div className="wpc-card" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <h3 className="wpc-card-title">
              <Send size={16} className="text-pink-wpc" />
              <span>Dispatch Real-Time Broadcast Alert</span>
            </h3>
            <p style={{ fontSize: '13px', marginBottom: '16px' }} className="text-muted-wpc">
              Send an instant notification popup to all active users viewing the Keryx platform.
            </p>

            {broadcastSuccess && (
              <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '6px', background: '#edfaef', border: '1px solid #b8e6bf', color: '#0a6b1f', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} />
                <span>{broadcastSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
              <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <Send size={16} />
                <span>Broadcast Alert Now</span>
              </button>
            </form>
          </div>
        )}
      </DashboardLayout>
    </div>
  );
};

export default AdminDashboardPage;
