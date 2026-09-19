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
    <div className="page-container events-page-container space-y-6">
      
      {/* Hero Banner Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
            <Calendar size={13} className="animate-pulse" />
            <span>Keryx Events Hub</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">
            Upcoming Tech Summits, Workshops & Campus Events
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Discover upcoming developer conferences, AI workshops, distributed systems bootcamps, and hackathons.
          </p>

          <div className="pt-2">
            <Link to="/write" className="btn btn-primary inline-flex items-center gap-2">
              <PlusCircle size={16} />
              <span>Publish Event</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search events by title, location, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              className="input-field text-xs font-semibold py-2.5 pr-8 cursor-pointer"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              className="input-field text-xs font-semibold py-2.5 pr-8 cursor-pointer"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="ONGOING">Live Now</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Display Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles size={20} className="text-blue-600" />
            <span>Scheduled Events ({filteredEvents.length})</span>
          </h2>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl text-center py-16 shadow-sm">
            <Calendar size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No events found matching your criteria</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your category filters or search terms.</p>
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
