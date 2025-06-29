import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, Customer } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User extends Customer {
  // Customer data from public.customers table
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, company?: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<Customer>) => Promise<void>;
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

  const fetchUserProfile = async (authUser: SupabaseUser): Promise<User | null> => {
    try {
      const { data: customer, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No customer record found, create one
          const newCustomer = {
            user_id: authUser.id,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Customer',
            email: authUser.email,
            phone: authUser.phone || '',
            company_name: authUser.user_metadata?.company || null,
            total_orders: 0,
            total_spent: 0
          };

          const { data: createdCustomer, error: createError } = await supabase
            .from('customers')
            .insert([newCustomer])
            .select()
            .single();

          if (createError) {
            console.error('Error creating customer profile:', createError);
            return null;
          }

          return createdCustomer;
        }
        console.error('Error fetching customer profile:', error);
        return null;
      }

      return customer;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user);
          setUser(profile);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchUserProfile(session.user);
          setUser(profile);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const profile = await fetchUserProfile(data.user);
        setUser(profile);
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, company?: string, phone?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            company,
            phone
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create customer profile
        const customerData = {
          user_id: data.user.id,
          name,
          email,
          phone: phone || '',
          company_name: company || null,
          total_orders: 0,
          total_spent: 0
        };

        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .insert([customerData])
          .select()
          .single();

        if (customerError) {
          console.error('Error creating customer profile:', customerError);
        } else {
          setUser(customer);
        }
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<Customer>) => {
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    setUser(data);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}