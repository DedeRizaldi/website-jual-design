import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database based on auth user
  const fetchUserProfile = async (authUserId: string, email: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      // User not in database yet, return default user
      return {
        id: authUserId,
        email,
        role: 'user' as const,
        name: email.split('@')[0],
      };
    }

    return {
      id: data.id,
      email: data.email,
      role: data.role as 'user' | 'admin',
      name: data.name || email.split('@')[0],
    };
  };

  // Check session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id, session.user.email!);
          setUser(profile);
          // Save role to localStorage for redirect logic
          if (profile) {
            localStorage.setItem('user_role', profile.role);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        // Always set loading to false
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id, session.user.email!);
          setUser(profile);
          // Save role to localStorage for redirect logic
          if (profile) {
            localStorage.setItem('user_role', profile.role);
          }
        } else {
          setUser(null);
          localStorage.removeItem('user_role');
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = async (email: string, password: string, name: string) => {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Registration failed');

      // Insert user profile into users table
      const { error: profileError } = await supabase.from('users').insert([
        {
          id: authData.user.id,
          email: authData.user.email!,
          name,
          role: 'user',
        },
      ]);

      if (profileError) throw profileError;

      return { error: null };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { error: error.message || 'Registration failed' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Login failed');

      // User state will be updated by onAuthStateChange listener
      return { error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      return { error: error.message || 'Invalid email or password' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('user_role');
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};