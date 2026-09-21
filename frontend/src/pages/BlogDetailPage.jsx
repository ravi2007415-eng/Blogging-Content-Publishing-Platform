import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_BLOGS } from '../mockData';
import { blogApi } from '../api/blogApi';
import { CommentSection } from '../components/CommentSection';
import { formatDate, calculateReadTime } from '../utils/helpers';
import { ArrowLeft, Clock, Heart, Bookmark, Share2, Tag, Check, Calendar, Image as ImageIcon, Loader2 } from 'lucide-react';

export const BlogDetailPage = () => {
  const { idOrSlug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        let data = null;
        if (/^\d+$/.test(idOrSlug)) {
          try {
            data = await blogApi.getBlogById(idOrSlug);
          } catch {
            data = await blogApi.getBlogBySlug(idOrSlug);
          }
        } else {
          data = await blogApi.getBlogBySlug(idOrSlug);
        }

        if (data) {
          setBlog(data);
          setLikesCount(data.likesCount || 0);
        }
      } catch (err) {
        console.warn('Backend blog lookup failed, checking fallback:', err.message);
        const mock = MOCK_BLOGS.find(b => b.slug === idOrSlug || String(b.id) === idOrSlug) || MOCK_BLOGS[0];
        setBlog(mock);
        setLikesCount(mock?.likesCount || 0);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 size={32} className="animate-spin text-blue-600" />
        <span className="text-sm">Loading article...</span>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="page-container py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900">Article not found</h2>
        <Link to="/" className="btn btn-primary mt-4 inline-block">Back to Feed</Link>
      </div>
    );
  }

  const imageUrl = blog.coverImageUrl || blog.coverImage;
  const authorName = blog.author?.fullName || blog.author?.name || blog.author?.username || 'Technical Writer';

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const hasImage = Boolean(imageUrl) && !imgError;

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
              {blog.subCategoryName && blog.subCategoryName !== 'General' && (
                <span className="opacity-75"> → {blog.subCategoryName}</span>
              )}
            </span>
          </div>
        )}
        <h1 className="detail-title">{blog.title}</h1>

        <div className="detail-author-row">
          <div className="author-meta-large">
            <img
              src={blog.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={authorName}
              className="author-avatar-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
              }}
            />
            <div>
              <h4 className="author-name-lg">{authorName}</h4>
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
      {imageUrl && (
        <div className="detail-cover-wrapper">
          {hasImage ? (
            <img 
              src={imageUrl} 
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
