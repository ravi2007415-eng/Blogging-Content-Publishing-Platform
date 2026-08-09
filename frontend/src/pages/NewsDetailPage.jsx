import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsApi } from '../api/newsApi';
import { formatDate } from '../utils/helpers';
import { ArrowLeft, Clock, Eye, Radio, Award, Share2, Bookmark, Flame } from 'lucide-react';

export const NewsDetailPage = () => {
  const { idOrSlug } = useParams();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const data = await newsApi.getNewsByIdOrSlug(idOrSlug);
        setNews(data);
        const related = await newsApi.getLatestNews(3);
        setRelatedNews(related.filter(n => String(n.id) !== String(data?.id)));
      } catch (err) {
        console.error('Failed to load news detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="page-container text-center py-20">
        <p className="text-muted">Loading news article...</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="page-container text-center py-20">
        <h2>News Article Not Found</h2>
        <Link to="/news" className="btn btn-primary mt-4">
          Back to Latest News
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container news-detail-page max-w-4xl mx-auto space-y-8">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted">
        <Link to="/news" className="hover:text-cyan flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Latest News
        </Link>
        <span>/</span>
        <span className="text-pink font-semibold">{news.categoryName}</span>
        {news.subCategoryName && (
          <>
            <span>/</span>
            <span>{news.subCategoryName}</span>
          </>
        )}
      </div>

      {/* Main Article Container */}
      <article className="news-article-card glass-panel p-8 rounded-2xl space-y-6">
        
        {/* Badges Bar */}
        <div className="flex flex-wrap gap-2 items-center">
          {news.isBreaking && (
            <span className="badge badge-pink flex items-center gap-1">
              <Radio size={12} className="animate-pulse" /> BREAKING NEWS
            </span>
          )}
          {news.isTopStory && (
            <span className="badge badge-cyan flex items-center gap-1">
              <Award size={12} /> TOP STORY
            </span>
          )}
          {news.isTrending && (
            <span className="badge badge-yellow flex items-center gap-1">
              <Flame size={12} /> TRENDING
            </span>
          )}
          <span className="badge badge-outline">{news.categoryName}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
          {news.title}
        </h1>

        {/* Author & Timestamp Bar */}
        <div className="news-meta-bar flex flex-wrap justify-between items-center py-4 border-y border-glass text-sm text-muted gap-4">
          <div className="flex items-center gap-3">
            <div className="avatar-placeholder bg-pink-500/20 text-pink font-bold rounded-full w-9 h-9 flex items-center justify-center">
              {news.authorName ? news.authorName.charAt(0) : 'K'}
            </div>
            <div>
              <p className="font-semibold text-white">{news.authorName || 'Keryx Newsdesk'}</p>
              <p className="text-xs text-muted">Published: {formatDate(news.publishedAt || news.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Eye size={16} /> {news.viewsCount || 0} views</span>
          </div>
        </div>

        {/* Hero Cover Image */}
        {news.imageUrl && (
          <div className="news-cover-wrap rounded-xl overflow-hidden shadow-2xl">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full max-h-96 object-cover"
            />
          </div>
        )}

        {/* Excerpt Summary */}
        {news.summary && (
          <div className="news-excerpt p-4 rounded-xl glass-panel border-l-4 border-cyan text-lg font-medium text-slate-200">
            {news.summary}
          </div>
        )}

        {/* Article Main Body Content */}
        <div className="news-body-content prose prose-invert max-w-none text-slate-200 leading-relaxed space-y-4">
          {news.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

      </article>

      {/* Related News Section */}
      {relatedNews.length > 0 && (
        <section className="related-news-section space-y-4">
          <h3 className="text-xl font-bold">More Related News Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedNews.map(rel => (
              <div key={rel.id} className="glass-panel p-4 rounded-xl space-y-2">
                <span className="badge badge-outline text-xs">{rel.categoryName}</span>
                <h4 className="font-bold text-sm leading-snug hover:text-cyan transition">
                  <Link to={`/news/${rel.slug || rel.id}`}>{rel.title}</Link>
                </h4>
                <p className="text-xs text-muted line-clamp-2">{rel.summary}</p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default NewsDetailPage;
