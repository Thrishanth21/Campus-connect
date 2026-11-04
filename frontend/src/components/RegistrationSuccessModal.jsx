import React from 'react';
import { Check, X, Calendar, MapPin, Ticket, ExternalLink } from 'lucide-react';

export default function RegistrationSuccessModal({
  registration,
  event,
  isOpen,
  onClose,
  onViewMyRegistrations,
  onBrowseMore,
}) {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full p-8 relative overflow-hidden text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Figma Light Blue Circle with Checkmark */}
        <div className="w-20 h-20 bg-blue-50 border-8 border-blue-100/60 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
          <Check className="w-9 h-9 text-blue-600 stroke-[2.5]" />
        </div>

        {/* Modal Heading */}
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          Registration successful!
        </h3>
        <p className="text-sm text-slate-500 mt-1.5 font-medium">
          You're all set! A confirmation and campus entry pass have been generated.
        </p>

        {/* Event Preview Summary Card (From Figma Screen 5) */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold shadow-md"
            style={{ backgroundColor: event.accentColor || '#F97316' }}
          >
            <Ticket className="w-6 h-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-900 truncate">{event.title}</h4>
            <div className="mt-1 text-xs text-slate-500 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{event.date} • {event.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
            {registration?.ticketCode && (
              <div className="mt-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-white text-blue-700 border border-blue-200">
                Pass: {registration.ticketCode}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              if (onViewMyRegistrations) onViewMyRegistrations();
            }}
            className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-98 transition-all"
          >
            View My Registrations
          </button>
          <button
            onClick={() => {
              onClose();
              if (onBrowseMore) onBrowseMore();
            }}
            className="py-3 px-4 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all"
          >
            Browse Events
          </button>
        </div>
      </div>
    </div>
  );
}
