import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Bookmark, Clock, ArrowUpRight, Image as ImageIcon } from 'lucide-react';
import { formatDate, calculateReadTime } from '../utils/helpers';

export const BlogCard = ({ blog, onToggleLike, onToggleBookmark }) => {
  const [liked, setLiked] = useState(blog.isLiked || false);
  const [likesCount, setLikesCount] = useState(blog.likesCount || 0);
  const [bookmarked, setBookmarked] = useState(blog.isBookmarked || false);
  const [imgError, setImgError] = useState(false);

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikesCount(prev => (liked ? prev - 1 : prev + 1));
    if (onToggleLike) onToggleLike(blog.id);
  };

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked(!bookmarked);
    if (onToggleBookmark) onToggleBookmark(blog.id);
  };

  const hasImage = Boolean(blog.coverImage) && !imgError;

  return (
    <article className="blog-card">
      {/* 1. Article Image (Fixed 195px Medium Height with Fallback) */}
      <div className="card-image-wrapper">
        <Link to={`/blog/${blog.slug || blog.id}`} className="card-image-link" tabIndex={-1} aria-label={blog.title}>
          {hasImage ? (
            <img 
              src={blog.coverImage} 
              alt={blog.title} 
              className="card-image"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="card-image-placeholder">
              <ImageIcon size={28} className="text-muted opacity-60" />
              <span className="placeholder-text">No image available</span>
            </div>
          )}
        </Link>
      </div>

      {/* Card Body */}
      <div className="card-content">
        {/* 2. Category Badge */}
        {blog.category && (
          <div className="card-badge-row">
            <span className="card-category-pill">
              {blog.category.name}
            </span>
          </div>
        )}

        {/* 3. Title (Max 2 lines) */}
        <h3 className="card-title">
          <Link to={`/blog/${blog.slug || blog.id}`} title={blog.title}>
            <span>{blog.title}</span>
            <ArrowUpRight size={15} className="title-arrow" />
          </Link>
        </h3>

        {/* 4. Short Description / Excerpt (Max 2 lines) */}
        <p className="card-summary">{blog.summary}</p>

        {/* 5. Author & Reading Time Row */}
        <div className="card-author-row">
          <div className="author-meta">
            <img
              src={blog.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={blog.author?.name || 'Author'}
              className="author-avatar"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
              }}
            />
            <div className="author-info">
              <span className="author-name">{blog.author?.name || 'Anonymous Creator'}</span>
              <span className="post-date">{formatDate(blog.createdAt)}</span>
            </div>
          </div>
          <span className="read-time-pill">
            <Clock size={12} />
            <span>{blog.readTime || calculateReadTime(blog.content)}</span>
          </span>
        </div>

        {/* 6. Footer Interactive Actions */}
        <div className="card-footer">
          <div className="action-stats">
            <button
              onClick={handleLikeClick}
              className={`action-btn ${liked ? 'liked' : ''}`}
              title="Like post"
              type="button"
              aria-label="Like post"
            >
              <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
              <span>{likesCount}</span>
            </button>
            <Link to={`/blog/${blog.slug || blog.id}#comments`} className="action-btn" title="Comments" aria-label="Comments">
              <MessageSquare size={15} />
              <span>{blog.commentsCount || 0}</span>
            </Link>
          </div>

          <button
            onClick={handleBookmarkClick}
            className={`action-btn bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark post'}
            type="button"
            aria-label="Bookmark"
          >
            <Bookmark size={15} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
