import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Bookmark, Clock, ArrowUpRight } from 'lucide-react';
import { formatDate, calculateReadTime } from '../utils/helpers';

export const BlogCard = ({ blog, onToggleLike, onToggleBookmark, viewMode = 'grid' }) => {
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

  const imageSrc = blog.coverImageUrl || blog.coverImage;

  return (
    <article className={`wp-blog-card ${viewMode === 'list' ? 'wp-card-list' : 'wp-card-grid'}`}>
      {/* Cover Image */}
      {imageSrc && (
        <div className="card-image-wrapper">
          <Link to={`/blog/${blog.slug || blog.id}`}>
            <img src={imageSrc} alt={blog.title} className="card-image" />
          </Link>
          {blog.category && (
            <span className="card-category-badge">
              {blog.category.name || blog.category}
            </span>
          )}
        </div>
      )}

      <div className="card-content">
        {/* Author & Reader Meta */}
        <div className="author-meta">
          <img
            src={blog.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={blog.author?.fullName || blog.author?.username || 'Author'}
            className="author-avatar"
          />
          <div className="author-info">
            <span className="author-name">{blog.author?.fullName || blog.author?.username || 'WordPress Creator'}</span>
            <span className="post-date">{formatDate(blog.createdAt)}</span>
          </div>
          <span className="read-time-pill">
            <Clock size={12} />
            {blog.readTime || calculateReadTime(blog.content || '')}
          </span>
        </div>

        {/* Title & Summary */}
        <h3 className="card-title">
          <Link to={`/blog/${blog.slug || blog.id}`}>
            {blog.title}
            <ArrowUpRight size={16} className="title-arrow" />
          </Link>
        </h3>
        <p className="card-summary">{blog.summary}</p>

        {/* Taxonomy Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="tags-list">
            {blog.tags.map((tag, idx) => (
              <span key={idx} className="tag-pill">
                #{tag.name || tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer Interaction Bar */}
        <div className="card-footer">
          <div className="action-stats">
            <button
              onClick={handleLikeClick}
              className={`action-btn ${liked ? 'liked' : ''}`}
              title="Like post"
            >
              <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
              <span>{likesCount}</span>
            </button>
            <Link to={`/blog/${blog.slug || blog.id}#comments`} className="action-btn">
              <MessageSquare size={16} />
              <span>{blog.commentsCount || 0}</span>
            </Link>
          </div>

          <button
            onClick={handleBookmarkClick}
            className={`action-btn bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark post'}
          >
            <Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
