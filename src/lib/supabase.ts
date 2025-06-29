import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Customer {
  id: string; // UUID from customers table
  user_id: string; // UUID linking to auth.users
  name: string;
  phone: string;
  email?: string;
  address?: string;
  joined_date?: string;
  total_orders?: number;
  total_spent?: number;
  last_interaction?: string;
  billing_address?: string;
  shipping_address?: string;
  birthday?: string;
  secondary_phone?: string;
  company_name?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: number; // bigint from orders table
  date: string;
  customer_name: string;
  order_type: string;
  quantity: number;
  design_needed: boolean;
  delivery_date?: string;
  amount_received?: number;
  payment_method?: string;
  notes?: string;
  rate?: number;
  total_amount: number;
  balance_amount?: number;
  product_id?: number;
  customer_id?: string;
  user_id?: string;
  customer_phone?: string;
  is_deleted?: boolean;
  deleted_at?: string;
  designer_id?: string;
  created_at?: string;
  status?: string; // From order_status_log
}

export interface Payment {
  id: string; // UUID from payments table
  customer_id?: string;
  order_id?: number;
  total_amount: number;
  amount_paid: number;
  due_date?: string;
  status: 'Paid' | 'Partial' | 'Due';
  created_at?: string;
  payment_date?: string;
  created_by?: string;
  notes?: string;
  payment_method?: string;
  updated_at?: string;
}

export interface OrderStatus {
  id: string;
  order_id: number;
  status: 'Pending' | 'Design' | 'Printing' | 'Delivered';
  updated_by?: string;
  updated_at: string;
}

// Helper functions
export const getOrderStatus = async (orderId: number): Promise<string> => {
  const { data, error } = await supabase
    .from('order_status_log')
    .select('status')
    .eq('order_id', orderId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching order status:', error);
    return 'Pending';
  }

  return data?.status || 'Pending';
};

export const getOrderStatusHistory = async (orderId: number): Promise<OrderStatus[]> => {
  const { data, error } = await supabase
    .from('order_status_log')
    .select('*')
    .eq('order_id', orderId)
    .order('updated_at', { ascending: true });

  if (error) {
    console.error('Error fetching order status history:', error);
    return [];
  }

  return data || [];
};