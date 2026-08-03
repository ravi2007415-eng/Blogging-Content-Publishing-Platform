import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { INITIAL_CATEGORIES } from '../utils/constants';
import { PenSquare, Image, Tag, Layers, CheckCircle2, ArrowLeft } from 'lucide-react';

export const CreateEditBlogPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [tagsInput, setTagsInput] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80');
  const [status, setStatus] = useState('PUBLISHED');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto generate slug from title
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/');
    }, 800);
  };

  return (
    <div className="write-page-container">
      <button onClick={() => navigate(-1)} className="back-link">
        <ArrowLeft size={18} />
        <span>Cancel & Return</span>
      </button>

      <div className="write-card glass-panel">
        <div className="write-header">
          <PenSquare size={28} className="text-accent" />
          <div>
            <h2>Publish New Technical Story</h2>
            <p className="text-muted">Craft articles with code snippets, architecture diagrams, and tags.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="write-form">
          {/* Article Title */}
          <div className="form-group">
            <label className="form-label">Article Title</label>
            <input
              type="text"
              className="input-field title-input"
              placeholder="e.g., Architecting Resilient Distributed Queues with Kafka"
              value={title}
              onChange={handleTitleChange}
              required
            />
          </div>

          {/* Slug & Category Row */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">URL Slug</label>
              <input
                type="text"
                className="input-field"
                placeholder="architecting-resilient-queues"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>

            <div className="form-group flex-1">
              <label className="form-label">
                <Layers size={14} /> Category
              </label>
              <select
                className="input-field select-field"
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
              >
                {INITIAL_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cover Image URL */}
          <div className="form-group">
            <label className="form-label">
              <Image size={14} /> Cover Image URL
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="https://images.unsplash.com/..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
          </div>

          {/* Summary Excerpt */}
          <div className="form-group">
            <label className="form-label">Short Executive Summary</label>
            <input
              type="text"
              className="input-field"
              placeholder="A 1-2 sentence preview for your readers..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
            />
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">
              <Tag size={14} /> Tags (Comma separated)
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Java, Microservices, Cloud, Spring Boot"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          {/* Content Body */}
          <div className="form-group">
            <label className="form-label">Article Body (Markdown supported)</label>
            <textarea
              className="input-field body-textarea"
              rows="12"
              placeholder="Write your article here... Markdown headers (###), code blocks (```java), and quotes (>) are rendered automatically."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Submit Actions */}
          <div className="form-actions-row">
            <div className="status-toggle-wrap">
              <button
                type="button"
                className={`pill-btn ${status === 'PUBLISHED' ? 'active' : ''}`}
                onClick={() => setStatus('PUBLISHED')}
              >
                Publish Now
              </button>
              <button
                type="button"
                className={`pill-btn ${status === 'DRAFT' ? 'active' : ''}`}
                onClick={() => setStatus('DRAFT')}
              >
                Save Draft
              </button>
            </div>

            <button type="submit" className="btn btn-primary publish-btn" disabled={isSubmitting}>
              <CheckCircle2 size={18} />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Article'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
