import React, { useState } from 'react';
import { campusApi } from '../api/eventsApi';
import { useAuth } from '../context/AuthContext';
import { Layers, X, Play, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';

export default function ApiInspectorModal({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const [activeEndpoint, setActiveEndpoint] = useState('GET /api/events');
  const [responseOutput, setResponseOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const endpoints = [
    {
      method: 'GET',
      path: '/api/events',
      desc: 'Browse events.',
      test: async () => campusApi.getEvents(),
    },
    {
      method: 'GET',
      path: '/api/events/{id}',
      desc: 'Event details.',
      test: async () => campusApi.getEventById(selectedEventId),
    },
    {
      method: 'POST',
      path: '/api/registrations',
      desc: 'Create registration, 201 or 409.',
      test: async () => campusApi.createRegistration({ eventId: selectedEventId }),
    },
    {
      method: 'GET',
      path: '/api/me/registrations',
      desc: "Current user's registrations.",
      test: async () => campusApi.getMyRegistrations(),
    },
    {
      method: 'GET',
      path: '/api/events/{id}/registrations',
      desc: 'Attendee list (API currently does not enforce organizer access).',
      test: async () => campusApi.getEventAttendees(selectedEventId),
    },
  ];

  const handleTest = async (ep) => {
    setActiveEndpoint(`${ep.method} ${ep.path}`);
    setIsLoading(true);
    setResponseOutput(null);
    try {
      const res = await ep.test();
      setResponseOutput({
        status: res.status || 200,
        ok: true,
        data: res,
      });
    } catch (err) {
      setResponseOutput({
        status: err.status || 500,
        ok: false,
        error: err.message,
        details: err.registration ? { existingRegistration: err.registration } : null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!responseOutput) return;
    navigator.clipboard.writeText(JSON.stringify(responseOutput, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full p-6 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                API Endpoints Specification & Live Tester
              </h3>
              <p className="text-xs text-slate-500">
                Active Persona: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.role})
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Endpoints Table (from user uploaded image) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Specification Table
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Target ID:</span>
                <input
                  aria-label="Target event ID"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  placeholder="Paste database event UUID"
                  className="bg-slate-50 border border-slate-300 rounded px-2 py-0.5 text-xs font-mono font-semibold"
                />
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm bg-white">
              {endpoints.map((ep) => {
                const isSelected = activeEndpoint === `${ep.method} ${ep.path}`;
                return (
                  <div
                    key={`${ep.method}-${ep.path}`}
                    className={`p-3.5 flex items-center justify-between gap-3 transition-colors ${
                      isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            ep.method === 'GET'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {ep.method}
                        </span>
                        <span className="font-mono text-xs font-semibold text-orange-600 truncate">
                          {ep.path}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{ep.desc}</p>
                    </div>

                    <button
                      onClick={() => handleTest(ep)}
                      disabled={isLoading}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-blue-600 text-white shadow-sm transition-all"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Test</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Testing Notes:</p>
              <p>• <strong>POST /api/registrations</strong> returns <strong>201</strong> on first register, and <strong>409 Conflict</strong> if already registered.</p>
              <p>• The current Flask attendee endpoint has no sign-in or organizer ownership check. Add authentication and authorization before exposing attendee data publicly.</p>
            </div>
          </div>

          {/* Response Console */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Live Output Console
              </span>
              {responseOutput && (
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      responseOutput.status === 200 || responseOutput.status === 201
                        ? 'bg-emerald-100 text-emerald-800'
                        : responseOutput.status === 409
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    HTTP {responseOutput.status}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 bg-slate-900 text-slate-200 font-mono text-xs rounded-2xl p-4 overflow-y-auto max-h-[380px] shadow-inner border border-slate-800">
              {isLoading ? (
                <div className="text-slate-400 py-10 text-center">Executing request...</div>
              ) : responseOutput ? (
                <pre className="whitespace-pre-wrap break-all leading-relaxed">
                  {JSON.stringify(responseOutput, null, 2)}
                </pre>
              ) : (
                <div className="text-slate-500 text-center py-16">
                  Select an endpoint from the left table and click <strong>Test</strong> to inspect live payload responses.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
