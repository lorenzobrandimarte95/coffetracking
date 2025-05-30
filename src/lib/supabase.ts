import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for your database tables
export type User = {
  id: string;
  created_at: string;
  // Add other user fields here
};

export type Coffee = {
  id: string;
  created_at: string;
  // Add other coffee fields here
};

export interface DBUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  department: string;
  created_at: string;
}