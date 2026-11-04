import React, { useState, useEffect } from 'react';
import { campusApi } from '../api/eventsApi';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  Clock,
  Layers,
  Plus
} from 'lucide-react';

export default function OrganizerHubPage({ onSelectEvent, onOpenAttendees, onHostNew }) {
  const { currentUser, showToast } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await campusApi.getEvents();
      setEvents(res.data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentUser]);

  const organizedEvents = events.filter((e) => e.organizerId === currentUser.id);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Organizer Management Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Active Manager: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.role})
          </p>
        </div>

        <button
          onClick={onHostNew}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Host New Event</span>
        </button>
      </div>

      {/* Role Notice Banner */}
      {currentUser.role !== 'organizer' && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">
                You are currently signed in as a Student ({currentUser.name})
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Attendee rosters are available only to the Supabase account that created each event. Organizer privileges must be assigned to your account in Supabase app metadata.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Events Managed by You
          </span>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {organizedEvents.length}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {events.length} total events on campus
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Confirmed Attendees
          </span>
          <p className="text-2xl font-black text-blue-600 mt-2">
            {organizedEvents.reduce((acc, e) => acc + (e.registeredCount || 0), 0)}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Across your active events
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Average Fill Rate
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-2">
            {organizedEvents.length > 0
              ? `${Math.round(
                  (organizedEvents.reduce((acc, e) => acc + e.registeredCount, 0) /
                    organizedEvents.reduce((acc, e) => acc + e.capacity, 0)) *
                    100
                )}%`
              : '0%'}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Capacity utilization
          </span>
        </div>
      </div>

      {/* Managed Events List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Your Events & Attendee Rosters
        </h2>

        {organizedEvents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No events owned by {currentUser.name}</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Create an event to see it listed here. Events published by other accounts are not shown as yours.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={onHostNew}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
              >
                Create Event
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {organizedEvents.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700">
                      {ev.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      ID: {ev.id}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{ev.title}</h3>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.date} • {ev.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        <strong className="text-slate-800">{ev.registeredCount}</strong> / {ev.capacity} registered ({ev.spotsRemaining} spots left)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onOpenAttendees(ev.id)}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>View Attendee List</span>
                  </button>

                  <button
                    onClick={() => onSelectEvent(ev.id)}
                    className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
                    title="View Public Page"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
