import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink, Tag } from 'lucide-react';

export const EventCard = ({ event }) => {
  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'UPCOMING': return <span className="badge badge-success">UPCOMING</span>;
      case 'ONGOING': return <span className="badge badge-warning animate-pulse">LIVE NOW</span>;
      case 'COMPLETED': return <span className="badge badge-secondary">COMPLETED</span>;
      default: return <span className="badge badge-primary">{status || 'UPCOMING'}</span>;
    }
  };

  return (
    <div className="event-card glass-panel">
      <div className="event-card-banner" style={{ backgroundImage: `url(${event.coverImageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'})` }}>
        <div className="event-banner-overlay" />
        <div className="event-category-tags">
          <span className="badge badge-outline">{event.categoryName}</span>
          {event.subCategoryName && (
            <span className="badge badge-cyan">{event.subCategoryName}</span>
          )}
        </div>
        <div className="event-status-tag">
          {getStatusBadge(event.status)}
        </div>
      </div>

      <div className="event-card-body">
        <div className="event-date-pill">
          <Calendar size={14} />
          <span>{event.eventDate || 'TBD'}</span>
          {event.eventTime && (
            <>
              <span className="dot-sep">•</span>
              <Clock size={14} />
              <span>{event.eventTime}</span>
            </>
          )}
        </div>

        <h3 className="event-title">{event.title}</h3>
        <p className="event-description">{event.description}</p>

        <div className="event-location">
          <MapPin size={15} className="text-pink" />
          <span>{event.location || 'Online Event'}</span>
        </div>

        <div className="event-card-footer">
          <span className="event-organizer">By {event.organizer || 'Keryx Events'}</span>
          {event.registrationUrl && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-primary event-reg-btn"
            >
              <span>Register</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
