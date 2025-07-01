import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

// Define the shape of the user profile data
export interface User {
  id: string; 
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

// Define what the update function will accept
type ProfileUpdater = Omit<User, 'id' | 'user_id' | 'email' | 'total_orders' | 'total_spent' | 'joined_date'>;

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, company?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: ProfileUpdater) => Promise<void>; // Add the new function to the context type
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('customers')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        if (profile) setUser({ ...profile, id: profile.user_id });
      }
      setLoading(false);
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (_event === 'SIGNED_OUT') {
        setUser(null);
      } else if (_event === 'USER_UPDATED' || (_event === 'SIGNED_IN' && session?.user)) {
         const { data: profile } = await supabase
              .from('customers').select('*').eq('user_id', session.user.id).single();
         if (profile) setUser({ ...profile, id: profile.user_id });
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // ... (login logic is fine)
  };

  const signup = async (email: string, password: string, name: string, company_name?: string) => {
    // ... (signup logic is fine)
  };

  const logout = async () => {
    // ... (logout logic is fine)
  };

  // The new function to update the user's profile
  const updateProfile = async (updates: ProfileUpdater) => {
    if (!user) throw new Error("No user is logged in");
    
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    
    // Update the local user state immediately for a better UX
    if(data) {
        setUser({ ...data, id: data.user_id });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
      </div>
    );
  }
  
  const value = { user, login, signup, logout, updateProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
