import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_BLOGS } from '../mockData';
import { CommentSection } from '../components/CommentSection';
import { formatDate, calculateReadTime } from '../utils/helpers';
import { ArrowLeft, Clock, Heart, Bookmark, Share2, Tag, Check, Calendar } from 'lucide-react';

export const BlogDetailPage = () => {
  const { idOrSlug } = useParams();

  // Find blog by slug or id
  const blog = MOCK_BLOGS.find(
    (b) => b.slug === idOrSlug || b.id.toString() === idOrSlug
  ) || MOCK_BLOGS[0]; // fallback to first mock post for smooth UI preview

  const [liked, setLiked] = useState(blog.isLiked || false);
  const [likesCount, setLikesCount] = useState(blog.likesCount || 0);
  const [bookmarked, setBookmarked] = useState(blog.isBookmarked || false);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <article className="blog-detail-container">
      {/* Back button */}
      <Link to="/" className="back-link">
        <ArrowLeft size={18} />
        <span>Back to Feed</span>
      </Link>

      {/* Header Info */}
      <header className="detail-header">
        {blog.category && (
          <span className="badge badge-primary detail-category">
            {blog.category.name}
          </span>
        )}
        <h1 className="detail-title">{blog.title}</h1>

        <div className="detail-author-row glass-panel">
          <div className="author-meta-large">
            <img
              src={blog.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={blog.author?.name}
              className="author-avatar-lg"
            />
            <div className="author-details">
              <h4 className="author-name-lg">{blog.author?.name || 'Technical Writer'}</h4>
              <p className="author-bio">{blog.author?.bio || 'Building future tech systems.'}</p>
            </div>
          </div>

          <div className="meta-stats-column">
            <span className="meta-item">
              <Calendar size={14} />
              {formatDate(blog.createdAt)}
            </span>
            <span className="meta-item">
              <Clock size={14} />
              {blog.readTime || calculateReadTime(blog.content)}
            </span>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="detail-cover-wrapper">
          <img src={blog.coverImage} alt={blog.title} className="detail-cover-img" />
        </div>
      )}

      {/* Main Body Content */}
      <div className="detail-body-wrapper glass-panel">
        <div className="article-content">
          {blog.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return <h3 key={index} className="content-h3">{paragraph.replace('### ', '')}</h3>;
            }
            if (paragraph.startsWith('#### ')) {
              return <h4 key={index} className="content-h4">{paragraph.replace('#### ', '')}</h4>;
            }
            if (paragraph.startsWith('> ')) {
              return <blockquote key={index} className="content-quote">{paragraph.replace('> ', '')}</blockquote>;
            }
            if (paragraph.startsWith('```')) {
              const lines = paragraph.split('\n');
              const code = lines.slice(1, -1).join('\n');
              return (
                <pre key={index} className="content-code-block">
                  <code>{code || paragraph}</code>
                </pre>
              );
            }
            return <p key={index} className="content-p">{paragraph}</p>;
          })}
        </div>

        {/* Tags Row */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="detail-tags-row">
            <Tag size={16} className="text-muted" />
            {blog.tags.map((t, idx) => (
              <span key={idx} className="tag-pill">
                #{t.name || t}
              </span>
            ))}
          </div>
        )}

        {/* Engagement Floating Bar */}
        <div className="detail-actions-bar">
          <button
            onClick={handleLike}
            className={`btn ${liked ? 'btn-primary' : 'btn-secondary'} action-btn-large`}
          >
            <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
            <span>{likesCount} Likes</span>
          </button>

          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`btn ${bookmarked ? 'btn-primary' : 'btn-secondary'} action-btn-large`}
          >
            <Bookmark size={20} fill={bookmarked ? 'currentColor' : 'none'} />
            <span>{bookmarked ? 'Bookmarked' : 'Save Story'}</span>
          </button>

          <button onClick={handleShare} className="btn btn-secondary action-btn-large">
            {copied ? <Check size={20} className="text-green" /> : <Share2 size={20} />}
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Discussion / Comments Section */}
      <CommentSection blogId={blog.id} />
    </article>
  );
};
