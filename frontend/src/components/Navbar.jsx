import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Search } from 'lucide-react';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  title,
  subtitle,
}) {
  const { currentUser } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Title / Context */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search campus events, venues, tags..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* User Role Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <span
            className={`w-2 h-2 rounded-full ${
              currentUser.role === 'organizer' ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
          />
          <span className="capitalize">{currentUser.role}</span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
          />
          <span className="text-xs font-semibold text-slate-800 hidden lg:inline">
            {currentUser.name}
          </span>
        </div>
      </div>
    </header>
  );
}
