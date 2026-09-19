import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_BLOGS } from '../mockData';
import { CommentSection } from '../components/CommentSection';
import { formatDate, calculateReadTime } from '../utils/helpers';
import { ArrowLeft, Clock, Heart, Bookmark, Share2, Tag, Check, Calendar, Image as ImageIcon } from 'lucide-react';

export const BlogDetailPage = () => {
  const { idOrSlug } = useParams();

  // Find blog by slug or id
  const blog = MOCK_BLOGS.find(
    (b) => b.slug === idOrSlug || b.id.toString() === idOrSlug
  ) || MOCK_BLOGS[0];

  const [liked, setLiked] = useState(blog.isLiked || false);
  const [likesCount, setLikesCount] = useState(blog.likesCount || 0);
  const [bookmarked, setBookmarked] = useState(blog.isBookmarked || false);
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const hasImage = Boolean(blog.coverImage) && !imgError;

  return (
    <article className="blog-detail-container">
      {/* Back button */}
      <Link to="/" className="back-link">
        <ArrowLeft size={16} />
        <span>Back to Feed</span>
      </Link>

      {/* Header Info */}
      <header className="mb-6">
        {blog.category && (
          <div className="mb-3">
            <span className="badge badge-primary">
              {blog.category.name}
            </span>
          </div>
        )}
        <h1 className="detail-title">{blog.title}</h1>

        <div className="detail-author-row">
          <div className="author-meta-large">
            <img
              src={blog.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={blog.author?.name}
              className="author-avatar-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
              }}
            />
            <div>
              <h4 className="author-name-lg">{blog.author?.name || 'Technical Writer'}</h4>
              <p className="author-bio">{blog.author?.bio || 'Building future tech systems.'}</p>
            </div>
          </div>

          <div className="meta-stats-column">
            <span className="meta-item">
              <Calendar size={14} className="text-blue" />
              {formatDate(blog.createdAt)}
            </span>
            <span className="meta-item">
              <Clock size={14} className="text-blue" />
              {blog.readTime || calculateReadTime(blog.content)}
            </span>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="detail-cover-wrapper">
          {hasImage ? (
            <img 
              src={blog.coverImage} 
              alt={blog.title} 
              className="detail-cover-img" 
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="h-64 flex flex-col items-center justify-center bg-slate-100 text-slate-400 gap-2">
              <ImageIcon size={36} />
              <span className="text-sm">No cover image available</span>
            </div>
          )}
        </div>
      )}

      {/* Main Body Content */}
      <div className="detail-body-wrapper">
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
            <Tag size={16} className="text-slate-400" />
            {blog.tags.map((t, idx) => (
              <span key={idx} className="tag-pill">
                #{t.name || t}
              </span>
            ))}
          </div>
        )}

        {/* Engagement Floating Actions */}
        <div className="detail-actions-bar">
          <button
            onClick={handleLike}
            className={`btn ${liked ? 'btn-primary' : 'btn-secondary'} action-btn-large`}
            type="button"
          >
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
            <span>{likesCount} Likes</span>
          </button>

          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`btn ${bookmarked ? 'btn-primary' : 'btn-secondary'} action-btn-large`}
            type="button"
          >
            <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
            <span>{bookmarked ? 'Bookmarked' : 'Save Story'}</span>
          </button>

          <button onClick={handleShare} className="btn btn-secondary action-btn-large" type="button">
            {copied ? <Check size={18} className="text-emerald-600" /> : <Share2 size={18} />}
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Discussion / Comments Section */}
      <CommentSection blogId={blog.id} />
    </article>
  );
};

export default BlogDetailPage;
