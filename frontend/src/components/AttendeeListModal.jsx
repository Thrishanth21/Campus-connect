import React, { useState, useEffect } from 'react';
import { campusApi } from '../api/eventsApi';
import { useAuth } from '../context/AuthContext';
import { X, Users, ShieldAlert, CheckCircle, Search, Mail, IdCard, Calendar } from 'lucide-react';

export default function AttendeeListModal({ eventId, isOpen, onClose }) {
  const { currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAttendees = async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await campusApi.getEventAttendees(eventId);
      setData(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && eventId) {
      fetchAttendees();
    }
  }, [isOpen, eventId, currentUser]);

  if (!isOpen) return null;

  const filteredAttendees = (data?.attendees || []).filter(
    (a) =>
      a.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.ticketCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Event Attendee Roster
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {data?.eventTitle || 'Campus Event Roster'} • Confirmed Attendees
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Loading attendee list...
            </div>
          ) : error ? (
            /* Restricted State Display */
            <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center my-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 mb-2">
                Organizer Access Only
              </span>
              <h4 className="text-sm font-bold text-red-900">Access Restricted</h4>
              <p className="text-xs text-red-700 mt-1 max-w-md mx-auto leading-relaxed">
                This attendee roster is available only to the account that created this event.
              </p>
              <div className="mt-5 p-3 rounded-xl bg-white/80 border border-red-100 text-left">
                <p className="text-xs text-slate-700 font-semibold">
                  Organizer Access:
                </p>
                <p className="text-xs text-slate-500 mt-1">Sign in with the Supabase account that published this event.</p>
              </div>
            </div>
          ) : (
            /* Valid Attendee List */
            <div>
              {/* Stats Bar & Filter */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-800">
                    {data.registeredCount} / {data.capacity} Attendees
                  </div>
                  <div className="text-xs text-slate-500">
                    {Math.max(0, data.capacity - data.registeredCount)} spots remaining
                  </div>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search attendee by name, ID..."
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs w-full sm:w-56 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {filteredAttendees.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No attendees matching "{searchQuery}"
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {filteredAttendees.map((att) => (
                    <div
                      key={att.id}
                      className="p-3.5 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 flex-shrink-0">
                          {att.userName?.charAt(0) || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">
                            {att.userName}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {att.userEmail}
                            </span>
                            <span>•</span>
                            <span className="font-mono">{att.studentId}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Confirmed
                        </span>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {att.ticketCode}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Current active user: <strong>{currentUser.name}</strong> ({currentUser.role})</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
