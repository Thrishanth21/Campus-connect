import React, { useState, useEffect } from 'react';
import { campusApi } from '../api/eventsApi';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import {
  Sparkles,
  ArrowRight,
  Filter,
  RefreshCw,
  Search,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function BrowseEventsPage({
  searchTerm,
  onSelectEvent,
  onRegisterSuccess,
}) {
  const { currentUser, showToast } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState('all');
  const [registeringId, setRegisteringId] = useState(null);

  const categories = ['All', 'Workshop', 'Hackathon', 'Career', 'Social', 'Seminar', 'Sports'];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await campusApi.getEvents({
        search: searchTerm,
        category: selectedCategory,
        filter: activeFilter,
      });
      setEvents(res.data);
    } catch (err) {
      showToast(err.message || 'Failed to load events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [searchTerm, selectedCategory, activeFilter, currentUser]);

  const handleRegister = async (eventId) => {
    setRegisteringId(eventId);
    try {
      // POST /api/registrations
      const res = await campusApi.createRegistration({ eventId });
      showToast('Registration successful! You are booked.', 'success');
      
      // Refresh event list to update spots and isRegistered state
      const targetEvent = events.find((e) => e.id === eventId);
      await fetchEvents();

      // Trigger Figma Registration Success modal
      if (onRegisterSuccess) {
        onRegisterSuccess(res.data, targetEvent);
      }
    } catch (err) {
      if (err.status === 409) {
        showToast('You are already registered for this event', 'warning');
      } else {
        showToast(err.message || 'Registration failed', 'error');
      }
    } finally {
      setRegisteringId(null);
    }
  };

  // Featured Spotlight Event (from Figma Screen 2 hero banner)
  const spotlightEvent = events.find((e) => e.isSpotlight) || events[0];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Figma Navy Hero Spotlight Banner */}
      {spotlightEvent && (
        <div className="bg-[#0F172A] rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-40 -bottom-20 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-6">
              {/* Figma Orange Thumbnail Block */}
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-2xl"
                style={{ backgroundColor: spotlightEvent.accentColor || '#F97316' }}
              >
                <Sparkles className="w-10 h-10 text-white" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Featured Spotlight
                  </span>
                  <span className="text-xs text-slate-400">
                    {spotlightEvent.category} • {spotlightEvent.date}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {spotlightEvent.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl line-clamp-2 leading-relaxed">
                  {spotlightEvent.tagline || spotlightEvent.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => onSelectEvent(spotlightEvent.id)}
                className="flex-1 md:flex-none px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>View Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {!spotlightEvent.isRegistered && (
                <button
                  onClick={() => handleRegister(spotlightEvent.id)}
                  disabled={registeringId === spotlightEvent.id}
                  className="px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-all"
                >
                  {registeringId === spotlightEvent.id ? 'Registering...' : 'Quick Register'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filter and Category Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Upcoming Events
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {events.length} campus event{events.length === 1 ? '' : 's'} available for registration
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'hover:text-slate-900'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setActiveFilter('registered')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === 'registered'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'hover:text-slate-900'
              }`}
            >
              My Registered
            </button>
            <button
              onClick={() => setActiveFilter('organized')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === 'organized'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'hover:text-slate-900'
              }`}
            >
              Organized by Me
            </button>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Grid (Figma Screen 2) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl h-80 border border-slate-200 animate-pulse p-6 space-y-4"
            >
              <div className="w-12 h-12 bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No events found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different category filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setActiveFilter('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSelectEvent={onSelectEvent}
              onRegister={handleRegister}
              isRegistering={registeringId === event.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
