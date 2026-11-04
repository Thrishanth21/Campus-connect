import React, { useState, useEffect } from 'react';
import { campusApi } from '../api/eventsApi';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  Share2,
  Ticket,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export default function EventDetailsPage({
  eventId,
  onBack,
  onRegisterSuccess,
  onOpenAttendees,
}) {
  const { currentUser, showToast } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      // GET /api/events/{id}
      const res = await campusApi.getEventById(eventId);
      setEvent(res.data);
    } catch (err) {
      showToast(err.message || 'Failed to fetch event', 'error', err.status);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId, currentUser]);

  const handleRegister = async () => {
    if (!event) return;
    setIsRegistering(true);
    try {
      // POST /api/registrations
      const res = await campusApi.createRegistration({ eventId: event.id });
      showToast('Registration successful!', 'success');
      await fetchEventDetails();
      if (onRegisterSuccess) {
        onRegisterSuccess(res.data, event);
      }
    } catch (err) {
      if (err.status === 409) {
        showToast('You are already registered for this event', 'warning');
      } else {
        showToast(err.message || 'Registration failed', 'error');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!event?.myRegistration) return;
    setIsCancelling(true);
    try {
      await campusApi.cancelRegistration(event.myRegistration.id);
      showToast('Registration cancelled', 'info');
      await fetchEventDetails();
    } catch (err) {
      showToast(err.message || 'Failed to cancel', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-slate-200 rounded" />
        <div className="h-64 bg-slate-200 rounded-3xl" />
        <div className="h-32 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-12 text-center max-w-md mx-auto">
        <p className="text-slate-500 text-sm">Event not found.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Events
        </button>
      </div>
    );
  }

  const isFull = event.spotsRemaining <= 0;
  const isRegistered = event.isRegistered;
  const percentFilled = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all events</span>
        </button>
      </div>

      {/* Figma Hero Area (Screens 3 & 4) */}
      <div className="bg-gradient-to-br from-slate-100 to-blue-50/50 rounded-3xl p-8 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-start sm:items-center gap-6">
          {/* Orange Graphic Square */}
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex-shrink-0 flex items-center justify-center text-white shadow-xl transform rotate-1"
            style={{ backgroundColor: event.accentColor || '#F97316' }}
          >
            <Sparkles className="w-10 h-10 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-white text-slate-800 border border-slate-200">
                {event.category}
              </span>
              {isRegistered && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  You're Attending
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {event.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Hosted by <strong className="text-slate-800">{event.organizerName}</strong> • {event.organizerRole}
            </p>
          </div>
        </div>

        {/* Organizer Quick Actions */}
        {event.isOrganizer && (
          <div className="w-full sm:w-auto p-3 bg-amber-50 rounded-2xl border border-amber-200 text-right">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              Organizer Controls
            </span>
            <button
              onClick={() => onOpenAttendees(event.id)}
              className="mt-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              View Attendee Roster
            </button>
          </div>
        )}
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Event Narrative & Schedule */}
        <div className="lg:col-span-8 space-y-6">
          {/* About This Event */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">About this event</h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {event.description}
            </p>

            {event.prerequisites && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 uppercase tracking-wider block text-[11px]">
                  What to Bring & Prerequisites
                </span>
                <p>{event.prerequisites}</p>
              </div>
            )}
          </div>

          {/* Schedule Breakdown */}
          {event.schedule && event.schedule.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Event Schedule</h2>
              <div className="space-y-3">
                {event.schedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-3 rounded-xl bg-slate-50/70 border border-slate-100"
                  >
                    <span className="text-xs font-mono font-bold text-blue-600 w-20 flex-shrink-0 pt-0.5">
                      {item.time}
                    </span>
                    <span className="text-xs font-medium text-slate-800">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Venue & Location Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Location & Venue</h2>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{event.location}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{event.building}</p>
                <p className="text-xs text-slate-400 mt-1">Campus Main Campus • ID card scan required at entrance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar: Reservation Card (Figma Screen 3 & 4) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-5">
            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                Registration
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Reserve your spot
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Reserve your spot for event updates, materials, and campus entry.
              </p>
            </div>

            {/* Quick Details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="font-medium">{event.date}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>

            {/* Capacity Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Spots remaining</span>
                <span className="font-bold text-slate-900">
                  {event.spotsRemaining} of {event.capacity} left
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${percentFilled}%` }}
                />
              </div>
            </div>

            {/* CTA Button Action */}
            {isRegistered ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-bold text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    You are registered!
                  </div>
                  {event.myRegistration?.ticketCode && (
                    <div className="mt-2 text-xs font-mono font-bold text-emerald-900 bg-white/80 py-1 px-2 rounded-lg border border-emerald-200">
                      Ticket: {event.myRegistration.ticketCode}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCancelRegistration}
                  disabled={isCancelling}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors"
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel My Registration'}
                </button>
              </div>
            ) : isFull ? (
              <button
                disabled
                className="w-full py-3.5 px-4 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
              >
                Event Capacity Reached
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={isRegistering}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 active:scale-98 transition-all disabled:opacity-50"
              >
                {isRegistering ? 'Creating Registration...' : 'Register for Event'}
              </button>
            )}

            {/* Organizer Attendee List Trigger */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => onOpenAttendees(event.id)}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <Users className="w-4 h-4 text-slate-500" />
                <span>
                  {event.isOrganizer
                    ? 'View Attendee Roster'
                    : 'Attendee Roster (Organizer Only)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
