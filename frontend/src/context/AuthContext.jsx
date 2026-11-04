import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../api/supabaseClient';

const AuthContext = createContext(null);

function toCampusUser(user) {
  if (!user) return null;
  const metadata = user.user_metadata || {};
  const trustedMetadata = user.app_metadata || {};
  return {
    id: user.id,
    email: user.email || '',
    name: metadata.full_name || metadata.name || user.email?.split('@')[0] || 'Campus User',
    role: trustedMetadata.role === 'organizer' ? 'organizer' : 'student',
    department: trustedMetadata.department || '',
    avatar: metadata.avatar_url || '',
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return undefined;
    }

    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) showToast(error.message, 'error');
      setSession(data?.session || null);
      setCurrentUser(toCampusUser(data?.session?.user));
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setCurrentUser(toCampusUser(nextSession?.user));
      setIsLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const showToast = (message, type = 'info', code = null) => {
    setToast({ message, type, code, id: Date.now() });
    setTimeout(() => setToast(null), 4500);
  };

  const login = async (email, password) => {
    if (!supabase) throw new Error('Supabase Auth is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in frontend/.env.');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setSession(data.session);
    setCurrentUser(toCampusUser(data.user));
    return data;
  };

  const signup = async (email, password, name) => {
    if (!supabase) throw new Error('Supabase Auth is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in frontend/.env.');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name }, emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
    if (data.session) {
      setSession(data.session);
      setCurrentUser(toCampusUser(data.user));
    }
    return data;
  };

  const logout = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setCurrentUser(null);
  };

  const value = useMemo(() => ({
    currentUser,
    session,
    isAuthenticated: Boolean(session),
    isLoading,
    isSupabaseConfigured: Boolean(supabase),
    toast,
    login,
    signup,
    logout,
    showToast,
    clearToast: () => setToast(null),
  }), [currentUser, session, isLoading, toast]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
