import { createClient, SupabaseClient } from '@supabase/supabase-js';

// These environment variables need to be set in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export let supabase: SupabaseClient | null = null;
export let supabaseInitializationError: string | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  supabaseInitializationError = 'Missing Supabase environment variables: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY must be defined in your .env file.';
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    if (error instanceof Error) {
      supabaseInitializationError = `Error initializing Supabase client: ${error.message}`;
    } else {
      supabaseInitializationError = 'An unknown error occurred during Supabase client initialization.';
    }
    supabase = null; // Ensure supabase is null if initialization fails
  }
}

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