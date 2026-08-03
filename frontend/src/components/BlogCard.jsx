import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Bookmark, Clock, ArrowUpRight } from 'lucide-react';
import { formatDate, calculateReadTime } from '../utils/helpers';

export const BlogCard = ({ blog, onToggleLike, onToggleBookmark }) => {
  const [liked, setLiked] = useState(blog.isLiked || false);
  const [likesCount, setLikesCount] = useState(blog.likesCount || 0);
  const [bookmarked, setBookmarked] = useState(blog.isBookmarked || false);

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

  return (
    <article className="glass-card blog-card">
      {/* Article Cover Header */}
      {blog.coverImage && (
        <div className="card-image-wrapper">
          <Link to={`/blog/${blog.slug || blog.id}`}>
            <img src={blog.coverImage} alt={blog.title} className="card-image" />
          </Link>
          {blog.category && (
            <span className="card-category-badge badge badge-primary">
              {blog.category.name}
            </span>
          )}
        </div>
      )}

      <div className="card-content">
        {/* Author Header */}
        <div className="author-meta">
          <img
            src={blog.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={blog.author?.name || 'Author'}
            className="author-avatar"
          />
          <div className="author-info">
            <span className="author-name">{blog.author?.name || 'Anonymous Developer'}</span>
            <span className="post-date">{formatDate(blog.createdAt)}</span>
          </div>
          <span className="read-time-pill">
            <Clock size={12} />
            {blog.readTime || calculateReadTime(blog.content)}
          </span>
        </div>

        {/* Title & Excerpt */}
        <h3 className="card-title">
          <Link to={`/blog/${blog.slug || blog.id}`}>
            {blog.title}
            <ArrowUpRight size={18} className="title-arrow" />
          </Link>
        </h3>
        <p className="card-summary">{blog.summary}</p>

        {/* Tags list */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="tags-list">
            {blog.tags.map((tag, idx) => (
              <span key={idx} className="tag-pill">
                #{tag.name || tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="card-footer">
          <div className="action-stats">
            <button
              onClick={handleLikeClick}
              className={`action-btn ${liked ? 'liked' : ''}`}
              title="Like post"
            >
              <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
              <span>{likesCount}</span>
            </button>
            <Link to={`/blog/${blog.slug || blog.id}#comments`} className="action-btn">
              <MessageSquare size={18} />
              <span>{blog.commentsCount || 0}</span>
            </Link>
          </div>

          <button
            onClick={handleBookmarkClick}
            className={`action-btn bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark post'}
          >
            <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </article>
  );
};
