import React, { useState, useEffect } from 'react';
import { campusApi } from '../api/eventsApi';
import { useAuth } from '../context/AuthContext';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Trash2,
  ArrowRight,
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';

export default function MyRegistrationsPage({ onSelectEvent, onBrowseEvents }) {
  const { currentUser, showToast } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      // GET /api/me/registrations
      const res = await campusApi.getMyRegistrations();
      setRegistrations(res.data);
    } catch (err) {
      showToast(err.message || 'Failed to load registrations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [currentUser]);

  const handleCancel = async (regId) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) return;
    setCancellingId(regId);
    try {
      await campusApi.cancelRegistration(regId);
      showToast('Registration cancelled successfully', 'info');
      await fetchRegistrations();
    } catch (err) {
      showToast(err.message || 'Failed to cancel', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Event Registrations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered as <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.email})
          </p>
        </div>

        <button
          onClick={onBrowseEvents}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          Discover More Events
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 py-8">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 bg-white rounded-3xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : registrations.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-slate-200">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No active registrations</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You haven't registered for any campus events yet. Explore upcoming workshops and hackathons!
          </p>
          <button
            onClick={onBrowseEvents}
            className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20"
          >
            Browse Campus Events
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {registrations.map((reg) => (
            <div
              key={reg.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-all"
            >
              {/* Left Ticket Stub / Info */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Confirmed Entry Pass
                    </span>
                    <span className="text-xs text-slate-400">
                      Registered on {new Date(reg.registeredAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {reg.event?.title || reg.eventTitle}
                  </h3>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-800">
                        {reg.event?.date || reg.eventDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>{reg.event?.time || reg.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="truncate">{reg.event?.location || reg.eventLocation}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                  <button
                    onClick={() => onSelectEvent(reg.eventId)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>View Event Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleCancel(reg.id)}
                    disabled={cancellingId === reg.id}
                    className="text-xs font-semibold text-slate-400 hover:text-red-600 ml-auto flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{cancellingId === reg.id ? 'Cancelling...' : 'Cancel Registration'}</span>
                  </button>
                </div>
              </div>

              {/* Right Ticket Barcode / QR Code Strip */}
              <div className="bg-slate-50 border-t md:border-t-0 md:border-l border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center w-full md:w-56 flex-shrink-0">
                <img
                  src={reg.qrCode}
                  alt="QR Pass"
                  className="w-24 h-24 rounded-xl border border-slate-200 bg-white p-1.5 shadow-inner"
                />
                <span className="mt-2 text-[11px] font-mono font-bold text-slate-800 tracking-wider">
                  {reg.ticketCode}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Scan at venue door
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
