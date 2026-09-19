import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsApi } from '../api/newsApi';
import { formatDate } from '../utils/helpers';
import { ArrowLeft, Clock, Eye, Radio, Award, Flame, Image as ImageIcon } from 'lucide-react';

export const NewsDetailPage = () => {
  const { idOrSlug } = useParams();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const data = await newsApi.getNewsByIdOrSlug(idOrSlug);
        setNews(data);
        const related = await newsApi.getLatestNews(3);
        setRelatedNews((related || []).filter(n => String(n.id) !== String(data?.id)));
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
        <p className="text-slate-500">Loading news article...</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="page-container text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">News Article Not Found</h2>
        <Link to="/news" className="btn btn-primary mt-4">
          Back to Latest News
        </Link>
      </div>
    );
  }

  const hasImage = Boolean(news.imageUrl) && !imgError;

  return (
    <div className="page-container news-detail-page max-w-4xl mx-auto space-y-8">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/news" className="hover:text-blue-600 flex items-center gap-1">
          <ArrowLeft size={13} /> Back to Latest News
        </Link>
        <span>/</span>
        <span className="text-blue-600 font-semibold">{news.categoryName}</span>
        {news.subCategoryName && (
          <>
            <span>/</span>
            <span>{news.subCategoryName}</span>
          </>
        )}
      </div>

      {/* Main Article Container */}
      <article className="bg-white border border-slate-200 p-6 md:p-10 rounded-2xl shadow-sm space-y-6">
        
        {/* Badges Bar */}
        <div className="flex flex-wrap gap-2 items-center">
          {news.isBreaking && (
            <span className="badge badge-pink flex items-center gap-1 font-bold">
              <Radio size={12} className="animate-pulse" /> BREAKING NEWS
            </span>
          )}
          {news.isTopStory && (
            <span className="badge badge-cyan flex items-center gap-1 font-bold">
              <Award size={12} /> TOP STORY
            </span>
          )}
          {news.isTrending && (
            <span className="badge badge-yellow flex items-center gap-1 font-bold">
              <Flame size={12} /> TRENDING
            </span>
          )}
          <span className="badge badge-outline">{news.categoryName}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight">
          {news.title}
        </h1>

        {/* Author & Timestamp Bar */}
        <div className="flex flex-wrap justify-between items-center py-4 border-y border-slate-100 text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 text-blue-600 font-bold rounded-full w-9 h-9 flex items-center justify-center border border-blue-100">
              {news.authorName ? news.authorName.charAt(0) : 'K'}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">{news.authorName || 'Keryx Newsdesk'}</p>
              <p className="text-slate-400">Published: {formatDate(news.publishedAt || news.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-medium"><Eye size={14} className="text-blue-600" /> {news.viewsCount || 0} views</span>
          </div>
        </div>

        {/* Hero Cover Image */}
        {news.imageUrl && (
          <div className="rounded-xl overflow-hidden border border-slate-200 max-h-96">
            {hasImage ? (
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full max-h-96 object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="h-48 bg-slate-100 flex items-center justify-center text-slate-400 gap-2">
                <ImageIcon size={28} />
                <span className="text-xs">No image available</span>
              </div>
            )}
          </div>
        )}

        {/* Excerpt Summary */}
        {news.summary && (
          <div className="p-4 rounded-xl bg-blue-50/60 border-l-4 border-blue-600 text-base font-medium text-slate-800 leading-relaxed">
            {news.summary}
          </div>
        )}

        {/* Article Main Body Content */}
        <div className="text-slate-800 text-base md:text-lg leading-relaxed space-y-4">
          {news.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

      </article>

      {/* Related News Section */}
      {relatedNews.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">More Related News Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedNews.map(rel => (
              <div key={rel.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2">
                <span className="badge badge-outline text-[11px]">{rel.categoryName}</span>
                <h4 className="font-bold text-sm text-slate-900 leading-snug hover:text-blue-600 transition">
                  <Link to={`/news/${rel.slug || rel.id}`}>{rel.title}</Link>
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{rel.summary}</p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default NewsDetailPage;
