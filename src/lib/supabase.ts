import { createClient } from '@supabase/supabase-js'
import { cache } from 'react'
import type { Database } from '@/types/supabase'

/**
 * Supabase client singleton for Next.js
 * 
 * Creates a single Supabase client instance that can be reused
 * across server components and API routes.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Server-side: don't persist sessions
    autoRefreshToken: false,
  },
})

/**
 * Cached Supabase queries for per-request deduplication
 * 
 * Use this for queries that may be called multiple times
 * within the same request to avoid duplicate API calls.
 * 
 * Example:
 * ```ts
 * export const getCity = cache(async (slug: string) => {
 *   const { data } = await supabase
 *     .from('cities')
 *     .select('*')
 *     .eq('slug', slug)
 *     .single()
 *   return data
 * })
 * ```
 */
export { cache }

