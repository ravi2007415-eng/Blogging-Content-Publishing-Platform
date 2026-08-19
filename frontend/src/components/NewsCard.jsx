import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Radio, Flame, Award, ArrowUpRight } from 'lucide-react';
import { formatDate } from '../utils/helpers';

export const NewsCard = ({ news }) => {
  return (
    <div className="news-card glass-panel flex flex-col justify-between">
      <div>
        <div className="news-card-image-wrap relative">
          <img
            src={news.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80'}
            alt={news.title}
            className="news-card-image"
          />
          <div className="news-card-overlay" />
          
          <div className="news-badges-bar flex gap-2">
            {news.isBreaking && (
              <span className="badge badge-pink flex items-center gap-1">
                <Radio size={12} className="animate-pulse" /> BREAKING
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
          </div>
        </div>

        <div className="news-card-content p-5">
          <div className="news-meta-row flex justify-between items-center text-xs text-muted mb-2">
            <span className="news-cat-tag font-bold text-pink">
              {news.categoryName}{news.subCategoryName ? ` → ${news.subCategoryName}` : ''}
            </span>
            <span className="news-time flex items-center gap-1">
              <Clock size={12} />
              {formatDate(news.publishedAt || news.createdAt)}
            </span>
          </div>

          <h3 className="news-card-title text-lg font-bold leading-snug mb-2 hover:text-cyan transition">
            <Link to={`/news/${news.slug || news.id}`}>{news.title}</Link>
          </h3>

          <p className="news-card-summary text-xs text-muted line-clamp-2 mb-4">
            {news.summary}
          </p>
        </div>
      </div>

      <div className="news-card-footer px-5 pb-5 pt-3 border-t border-glass flex justify-between items-center">
        <span className="text-xs text-muted flex items-center gap-1">
          <Eye size={13} /> {news.viewsCount || 0} views
        </span>
        <Link to={`/news/${news.slug || news.id}`} className="btn btn-xs btn-primary flex items-center gap-1">
          <span>Read Full Story</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;
