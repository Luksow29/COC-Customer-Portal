import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { UserProfile } from '../lib/supabase';

interface User extends UserProfile {
  // Additional user properties if needed
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, company?: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
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

  const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      console.log('Fetching user profile for:', supabaseUser.id);
      
      // First, check if customer profile exists
      const { data: customer, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching customer profile:', error);
        return null;
      }

      if (customer) {
        console.log('Found existing customer:', customer);
        return {
          id: supabaseUser.id,
          name: customer.name,
          email: supabaseUser.email || customer.email || '',
          phone: customer.phone,
          address: customer.address,
          company_name: customer.company_name,
          joined_date: customer.joined_date,
          total_orders: customer.total_orders || 0,
          total_spent: customer.total_spent || 0,
          last_interaction: customer.last_interaction,
          billing_address: customer.billing_address,
          shipping_address: customer.shipping_address,
          birthday: customer.birthday,
          secondary_phone: customer.secondary_phone,
          tags: customer.tags || []
        };
      }

      // If no customer profile exists, create one
      console.log('Creating new customer profile for:', supabaseUser.email);
      const newCustomer = {
        user_id: supabaseUser.id,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email,
        phone: supabaseUser.user_metadata?.phone || '',
        company_name: supabaseUser.user_metadata?.company || '',
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

      console.log('Created new customer:', createdCustomer);
      return {
        id: supabaseUser.id,
        name: createdCustomer.name,
        email: supabaseUser.email || '',
        phone: createdCustomer.phone,
        address: createdCustomer.address,
        company_name: createdCustomer.company_name,
        joined_date: createdCustomer.joined_date,
        total_orders: 0,
        total_spent: 0,
        last_interaction: createdCustomer.last_interaction,
        billing_address: createdCustomer.billing_address,
        shipping_address: createdCustomer.shipping_address,
        birthday: createdCustomer.birthday,
        secondary_phone: createdCustomer.secondary_phone,
        tags: createdCustomer.tags || []
      };
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('Found session for user:', session.user.email);
          const userProfile = await fetchUserProfile(session.user);
          setUser(userProfile);
        } else {
          console.log('No active session found');
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          setUser(userProfile);
        } else {
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
      console.log('Attempting login for:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      console.log('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, company?: string, phone?: string) => {
    setLoading(true);
    try {
      console.log('Attempting signup for:', email);
      const { error } = await supabase.auth.signUp({
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
      console.log('Signup successful');
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      console.log('Logging out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    console.log('Sending password reset for:', email);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    try {
      console.log('Updating profile for user:', user.id);
      const { error } = await supabase
        .from('customers')
        .update({
          name: updates.name,
          phone: updates.phone,
          address: updates.address,
          company_name: updates.company_name,
          billing_address: updates.billing_address,
          shipping_address: updates.shipping_address,
          birthday: updates.birthday,
          secondary_phone: updates.secondary_phone,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local user state
      setUser(prev => prev ? { ...prev, ...updates } : null);
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error(error instanceof Error ? error.message : 'Profile update failed');
    }
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