import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

// Define the shape of the user profile data from your 'customers' table
export interface User {
  id: string; // For consistency, this will be the user_id from the customers table
  user_id: string;
  name: string;
  email?: string;
  company_name?: string;
  phone?: string;
  address?: string;
  billing_address?: string;
  shipping_address?: string;
  secondary_phone?: string;
  total_orders?: number;
  total_spent?: number;
  joined_date?: string;
}

// Define the type for the function that will update the profile
type ProfileUpdater = Partial<Omit<User, 'id' | 'user_id' | 'email' | 'total_orders' | 'total_spent' | 'joined_date'>>;

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, company?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: ProfileUpdater) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        const supabaseUser = session?.user;
        if (supabaseUser) {
          // Promise with a timeout as a safety net to prevent hangs
          const profilePromise = supabase
            .from('customers')
            .select('*')
            .eq('user_id', supabaseUser.id)
            .single();

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Database request timed out. This is likely due to missing RLS policies on the "customers" table.')), 10000)
          );
          
          const { data: profile } = await Promise.race([profilePromise, timeoutPromise]);
          
          if (isMounted) {
            setUser(profile ? { ...profile, id: profile.user_id } : null);
          }
        } else if (isMounted) {
          setUser(null);
        }
      } catch (error) {
        console.error("AuthContext Error:", error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signup = async (email: string, password: string, name: string, company_name?: string) => {
    const { error } = await supabase.auth.signUp({
      email, password, options: { data: { name, company_name } }
    });
    if (error) throw error;
  };
  
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: ProfileUpdater) => {
    if (!user) throw new Error("No user is logged in");
    const { data, error } = await supabase.from('customers').update(updates).eq('user_id', user.user_id).select().single();
    if (error) throw error;
    if (data && isMounted) {
      setUser({ ...data, id: data.user_id });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
      </div>
    );
  }
  
  const value = { user, login, signup, logout, updateProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
