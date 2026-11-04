import React, { useState } from 'react';
import { campusApi } from '../api/eventsApi';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Info,
  Lightbulb
} from 'lucide-react';

export default function HostEventPage({ onEventCreated }) {
  const { currentUser, showToast } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    category: 'Workshop',
    date: '2026-11-28',
    time: '3:00 PM - 6:00 PM',
    location: '',
    building: 'Campus Center',
    capacity: 40,
    description: '',
    accentColor: '#F97316',
    prerequisites: 'Open to all students. Bring a notebook or laptop.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Workshop', 'Hackathon', 'Career', 'Social', 'Seminar', 'Sports'];
  const colors = [
    { label: 'Orange', value: '#F97316' },
    { label: 'Blue', value: '#2563EB' },
    { label: 'Purple', value: '#8B5CF6' },
    { label: 'Emerald', value: '#10B981' },
    { label: 'Rose', value: '#EF4444' },
    { label: 'Amber', value: '#F59E0B' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.description) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await campusApi.createEvent(formData, currentUser);
      showToast('Event published successfully!', 'success', 201);
      if (onEventCreated) {
        onEventCreated(res.data.id);
      }
    } catch (err) {
      showToast(err.message || 'Failed to create event', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview object for the live card preview
  const previewEvent = {
    id: 'preview',
    title: formData.title || 'Your Event Title Here',
    description: formData.description || 'Describe the goals, hands-on activities, and who should attend your campus event.',
    category: formData.category,
    date: formData.date,
    time: formData.time,
    location: formData.location || 'Campus Location (e.g. Student Union 204)',
    registeredCount: 0,
    capacity: parseInt(formData.capacity, 10) || 40,
    spotsRemaining: parseInt(formData.capacity, 10) || 40,
    accentColor: formData.accentColor,
    isRegistered: false,
    isOrganizer: true,
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header (Figma Screen 7) */}
      <div>
        <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
          Organizer Studio
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
          Host an Event — What are you planning?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Publish your event to the Campus Connect directory and track attendees in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (Figma Screen 7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Design Jam: Rapid Wireframing & Usability"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Capacity / Max Seats *
                </label>
                <input
                  type="number"
                  name="capacity"
                  min="5"
                  max="1000"
                  required
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Time Range *
                </label>
                <input
                  type="text"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="e.g. 2:00 PM - 5:00 PM"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Venue & Room *
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Design Studio 4, Room 201"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Event Description *
              </label>
              <textarea
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the activities, hands-on takeaways, agenda, and why students should join..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
              />
            </div>

            {/* Accent Theme Color */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Card Accent Color
              </label>
              <div className="flex items-center gap-3">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, accentColor: c.value }))}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      formData.accentColor === c.value ? 'scale-125 ring-2 ring-slate-900 ring-offset-2' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Publishing as <strong>{currentUser.name}</strong>
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 active:scale-98 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing Event...' : 'Publish Event'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Live Preview & Tips (Figma Screen 7) */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Live Card Preview
            </span>
            <EventCard
              event={previewEvent}
              onSelectEvent={() => {}}
              onRegister={() => {}}
            />
          </div>

          {/* Organizer Advice Card */}
          <div className="p-6 rounded-3xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-blue-950">
              <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>Organizer Best Practices</span>
            </div>
            <ul className="space-y-1.5 text-blue-800 list-disc list-inside">
              <li>Keep titles action-oriented (e.g. "Jam", "Hackathon", "Build").</li>
              <li>Include specific building and room numbers for smooth campus check-in.</li>
              <li>Cap capacity accurately to prevent room overcrowding.</li>
              <li>You can view and export attendee rosters anytime via Organizer Hub.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
