import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ExternalLink, Tag, Image as ImageIcon } from 'lucide-react';

export const EventCard = ({ event }) => {
  const [imgError, setImgError] = useState(false);

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'UPCOMING': return <span className="badge badge-success">UPCOMING</span>;
      case 'ONGOING': return <span className="badge badge-warning animate-pulse">LIVE NOW</span>;
      case 'COMPLETED': return <span className="badge badge-secondary">COMPLETED</span>;
      default: return <span className="badge badge-primary">{status || 'UPCOMING'}</span>;
    }
  };

  const defaultCover = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
  const coverSrc = imgError ? defaultCover : (event.coverImageUrl || defaultCover);

  return (
    <div className="event-card">
      <div 
        className="event-card-banner" 
        style={{ backgroundImage: `url(${coverSrc})` }}
      >
        <div className="event-banner-overlay" />
        <div className="event-category-tags relative z-10 flex gap-2 flex-wrap">
          <span className="badge badge-outline bg-white/90 text-slate-800 font-bold">{event.categoryName}</span>
          {event.subCategoryName && (
            <span className="badge badge-cyan bg-sky-50 text-sky-800 font-bold">{event.subCategoryName}</span>
          )}
        </div>
        <div className="event-status-tag relative z-10">
          {getStatusBadge(event.status)}
        </div>
      </div>

      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold mb-2">
            <Calendar size={13} />
            <span>{event.eventDate || 'TBD'}</span>
            {event.eventTime && (
              <>
                <span className="text-slate-300">•</span>
                <Clock size={13} />
                <span>{event.eventTime}</span>
              </>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2 leading-snug">{event.title}</h3>
          <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">{event.description}</p>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-4">
            <MapPin size={14} className="text-blue-600 shrink-0" />
            <span className="truncate">{event.location || 'Online Event'}</span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium truncate">By {event.organizer || 'Keryx Events'}</span>
            {event.registrationUrl && (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-xs btn-primary inline-flex items-center gap-1"
              >
                <span>Details</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
