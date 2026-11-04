import React, { useState, useEffect } from 'react';
import { campusApi } from '../api/eventsApi';
import { useAuth } from '../context/AuthContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function CalendarPage({ onSelectEvent }) {
  const { currentUser, showToast } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [selectedDateStr, setSelectedDateStr] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    const loadEvents = async () => {
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
    loadEvents();
  }, [currentUser]);

  // Compute calendar days for the current month
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Format YYYY-MM-DD
  const formatDayString = (day) => {
    const m = String(currentMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${currentYear}-${m}-${d}`;
  };

  // Find events on selected day
  const eventsOnSelectedDate = events.filter((e) => e.date === selectedDateStr);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Campus Calendar
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Plan your term and never miss a workshop, hackathon, or guest talk.
        </p>
      </div>

      {/* Main Calendar Screen Layout (Figma Screen 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Calendar Grid */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          {/* Month & Nav Controls */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">
              {monthNames[currentMonth]} {currentYear}
            </h2>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                aria-label="Next Month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-2 mb-3 text-center">
            {daysOfWeek.map((d) => (
              <span
                key={d}
                className="text-xs font-bold text-slate-400 uppercase tracking-wider py-1"
              >
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty prefix slots */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-14 rounded-2xl" />
            ))}

            {/* Day Cells */}
            {Array.from({ length: totalDaysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = formatDayString(day);
              const isSelected = selectedDateStr === dateStr;
              const hasEvents = events.some((e) => e.date === dateStr);
              const hasRegisteredEvents = events.some(
                (e) => e.date === dateStr && e.isRegistered
              );

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-14 rounded-2xl flex flex-col items-center justify-center relative transition-all group ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 font-bold'
                      : hasEvents
                      ? 'bg-slate-50 hover:bg-blue-50 text-slate-900 border border-slate-200/80 font-semibold'
                      : 'hover:bg-slate-50 text-slate-600 font-medium'
                  }`}
                >
                  <span className="text-sm">{day}</span>
                  {hasEvents && (
                    <div className="flex items-center gap-1 mt-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected
                            ? 'bg-white'
                            : hasRegisteredEvents
                            ? 'bg-emerald-500'
                            : 'bg-orange-500'
                        }`}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Selected Day</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Registered Event</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>Campus Event</span>
            </div>
          </div>
        </div>

        {/* Right Column: Events on Selected Date (Figma Screen 6) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Day Schedule
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-blue-50 text-blue-700">
                {eventsOnSelectedDate.length} Event{eventsOnSelectedDate.length === 1 ? '' : 's'}
              </span>
            </div>

            {eventsOnSelectedDate.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">No events scheduled</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click another highlighted day on the calendar to view events.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {eventsOnSelectedDate.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all bg-white flex flex-col justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {ev.category}
                        </span>
                        {ev.isRegistered && (
                          <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Registered
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {ev.title}
                      </h4>

                      <div className="mt-2 space-y-1 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ev.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{ev.location}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectEvent(ev.id)}
                      className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-slate-900 group-hover:bg-blue-600 text-white transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>View Event Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
