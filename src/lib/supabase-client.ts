'use client'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Client-side Supabase client for browser authentication
 * 
 * This client is used in client components and handles:
 * - User authentication (sign up, sign in, sign out)
 * - Session management
 * - Real-time subscriptions
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file.'
    )
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

