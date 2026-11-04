import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';

export default function SignInPage({ onSignedIn }) {
  const { login, signup, isSupabaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const authSetupMessage = import.meta.env.PROD
    ? 'Authentication is not configured for this deployment. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Netlify environment variables, then redeploy.'
    : 'Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to frontend/.env, then restart Vite.';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (isCreatingAccount) {
        const result = await signup(email, password, name);
        if (result.session && onSignedIn) onSignedIn();
        else setError('Account created. Check your email to confirm it, then sign in.');
      } else {
        await login(email, password);
        if (onSignedIn) onSignedIn();
      }
    } catch (authError) {
      setError(authError.message || 'Could not authenticate with Supabase.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC]">
      {/* Left Split Hero (Figma Navy Campus Illustration) */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#0F172A] p-12 flex-col justify-between relative overflow-hidden text-white">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Icon */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight leading-none text-white">
              Campus Connect
            </h1>
            <p className="text-xs text-slate-400 mt-1">Student & Event Platform</p>
          </div>
        </div>

        {/* Figma ID Card Illustration */}
        <div className="relative z-10 my-auto py-10 flex flex-col items-center">
          <div className="w-80 h-52 bg-white/95 rounded-3xl p-6 shadow-2xl backdrop-blur-md border border-white/40 transform -rotate-3 hover:rotate-0 transition-transform duration-300 relative">
            <div className="flex items-start gap-4 h-full">
              {/* Photo Area */}
              <div className="w-24 h-28 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-md">
                <span className="text-2xl font-bold">CC</span>
              </div>

              {/* Text Lines */}
              <div className="flex-1 space-y-3 pt-2">
                <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                <div className="h-3 bg-orange-500 rounded-md w-full" />
                <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                <div className="pt-4 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                    Verified ID
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 right-6 text-[10px] font-mono text-slate-400 font-semibold">
              ACADEMIC YEAR 2026
            </div>
          </div>

          <p className="text-sm text-slate-400 text-center mt-8 max-w-xs font-medium">
            Discover workshops, hackathons, and activities tailored to your university life.
          </p>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 text-xs text-slate-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Authentication powered by Supabase</span>
        </div>
      </div>

      {/* Right Form Split */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="mb-8">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
              Welcome to Campus Connect
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              {isCreatingAccount ? 'Create your campus account' : 'Sign in to your campus'}
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Use your Supabase account to access campus events.
            </p>
          </div>

          {!isSupabaseConfigured && (
            <div role="alert" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              {authSetupMessage}
            </div>
          )}
          {error && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isCreatingAccount && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-medium" />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Campus Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete={isCreatingAccount ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-medium transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!isSupabaseConfigured || isSubmitting}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Please wait…' : isCreatingAccount ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            {isCreatingAccount ? 'Already have an account?' : 'New to Campus Connect?'}{' '}
            <button type="button" onClick={() => { setError(''); setIsCreatingAccount((value) => !value); }} className="font-semibold text-blue-600 hover:underline">
              {isCreatingAccount ? 'Sign in' : 'Create an account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
