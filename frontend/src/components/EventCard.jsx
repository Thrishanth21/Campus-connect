import React from 'react';
import { Calendar, MapPin, Users, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function EventCard({
  event,
  onSelectEvent,
  onRegister,
  isRegistering = false,
}) {
  const isFull = event.spotsRemaining <= 0;
  const isRegistered = event.isRegistered;

  const categoryColors = {
    Workshop: 'bg-orange-50 text-orange-700 border-orange-200',
    Hackathon: 'bg-blue-50 text-blue-700 border-blue-200',
    Career: 'bg-purple-50 text-purple-700 border-purple-200',
    Social: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Seminar: 'bg-amber-50 text-amber-700 border-amber-200',
    Sports: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Card Header Thumbnail / Graphic */}
      <div className="h-36 bg-gradient-to-br from-slate-50 to-blue-50/40 p-5 relative border-b border-slate-100 flex items-center justify-between">
        {/* Figma styled Orange / Accent Badge */}
        <div
          className="w-14 h-14 rounded-2xl shadow-md flex items-center justify-center transform group-hover:scale-105 transition-transform"
          style={{
            backgroundColor: event.accentColor || '#F97316',
            boxShadow: `0 8px 16px -4px ${event.accentColor}33`,
          }}
        >
          <Sparkles className="w-7 h-7 text-white" />
        </div>

        {/* Category Badge */}
        <div className="flex flex-col items-end gap-1.5">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
              categoryColors[event.category] || 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {event.category}
          </span>
          {event.isOrganizer && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              Your Event
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <button
            onClick={() => onSelectEvent(event.id)}
            className="text-left group/title focus:outline-none"
          >
            <h3 className="text-base font-bold text-slate-900 group-hover/title:text-blue-600 transition-colors line-clamp-1">
              {event.title}
            </h3>
          </button>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="mt-4 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="font-medium text-slate-700">{event.date} • {event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>
                <strong className="text-slate-800 font-semibold">{event.registeredCount}</strong> registered
                <span className="text-slate-400"> / {event.capacity} total ({event.spotsRemaining} left)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => onSelectEvent(event.id)}
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1 py-1.5 transition-colors"
          >
            Details <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {isRegistered ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Registered
            </span>
          ) : isFull ? (
            <button
              disabled
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
            >
              At Capacity
            </button>
          ) : (
            <button
              onClick={() => onRegister(event.id)}
              disabled={isRegistering}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isRegistering ? 'Registering...' : 'Register'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
