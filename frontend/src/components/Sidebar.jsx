import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Calendar as CalendarIcon,
  Ticket,
  PlusCircle,
  Users,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView }) {
  const { currentUser, logout, showToast } = useAuth();

  const navItems = [
    { id: 'browse', label: 'Discover Events', icon: Compass, badge: null },
    { id: 'calendar', label: 'Campus Calendar', icon: CalendarIcon, badge: null },
    { id: 'registrations', label: 'My Registrations', icon: Ticket, badge: null },
    { id: 'host', label: 'Host an Event', icon: PlusCircle, badge: 'New' },
    { id: 'organizer', label: 'Organizer Hub', icon: Users, badge: 'Organizer' },
  ];

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 select-none z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight leading-none">
              Campus Connect
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">Event Hub UI</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Main Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isActive
                      ? 'bg-blue-700/60 text-white'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Switcher / Profile Footer */}
      <div className="p-4 border-t border-slate-800 bg-[#0A0F1D]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            Signed-in Supabase account
          </span>
        </div>

        {/* Active User Card */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-2.5 min-w-0">
              <img
              src={currentUser.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-600 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <div className="flex items-center gap-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    currentUser.role === 'organizer' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                />
                <p className="text-[10px] text-slate-400 capitalize truncate">
                  {currentUser.role}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={async () => {
              try { await logout(); }
              catch (error) { showToast(error.message || 'Sign out failed', 'error'); }
            }}
            title="Sign Out"
            className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
