import React, { useState, useContext } from 'react';
import { EventCard } from '../components/EventCard';
import { MOCK_EVENTS } from '../mockData';
import { CategoryContext } from '../context/CategoryContext';
import { Calendar, Search, Filter, PlusCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EventsPage = () => {
  const { categories } = useContext(CategoryContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'ALL' || 
      event.categoryName.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStatus = selectedStatus === 'ALL' || 
      event.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="page-container events-page-container">
      
      {/* Hero Banner Header */}
      <div className="events-hero-panel glass-panel">
        <div className="events-hero-content">
          <div className="hero-badge">
            <Calendar size={14} className="text-pink animate-pulse" />
            <span>Keryx Events Hub</span>
          </div>
          <h1 className="hero-title">Upcoming Sports, Tech & Campus Events</h1>
          <p className="hero-subtitle">
            Discover upcoming volleyball championships, AI tech summits, hackathons, college fests, and cultural conventions.
          </p>

          <div className="hero-actions flex gap-3 mt-4">
            <Link to="/write" className="btn btn-primary flex items-center gap-2">
              <PlusCircle size={18} />
              <span>Publish Event</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="events-filter-bar glass-panel my-6">
        <div className="search-filter-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="input-field search-input"
            placeholder="Search events by title, location, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-select-group">
          <div className="select-wrapper">
            <Filter size={14} className="select-icon" />
            <select
              className="input-field select-field"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="select-wrapper">
            <select
              className="input-field select-field"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">All Event Statuses</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="ONGOING">Live Now</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Display Grid */}
      <div className="events-section">
        <div className="section-title-row flex justify-between items-center mb-6">
          <h2 className="section-title flex items-center gap-2">
            <Sparkles size={20} className="text-cyan" />
            <span>Scheduled Events ({filteredEvents.length})</span>
          </h2>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="empty-events-panel glass-panel text-center py-16">
            <Calendar size={48} className="mx-auto text-muted mb-3" />
            <h3>No events found matching your criteria</h3>
            <p className="text-muted text-sm mt-1">Try adjusting your category filters or search terms.</p>
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
