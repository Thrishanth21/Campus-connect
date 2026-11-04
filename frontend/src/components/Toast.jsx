import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast, clearToast } = useAuth();
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
  };

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-fade-in">
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${bgStyles[toast.type] || bgStyles.info}`}>
        {icons[toast.type] || icons.info}
        <div className="flex-1 text-sm font-medium">
          <span>{toast.message}</span>
        </div>
        <button
          onClick={clearToast}
          className="text-gray-400 hover:text-gray-700 transition-colors p-0.5 rounded"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
