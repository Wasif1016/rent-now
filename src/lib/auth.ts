import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

/**
 * Server-side function to get the current user session
 *
 * It supports two ways of receiving the access token:
 * - Cookie: `sb-access-token` (classic Supabase SSR flow)
 * - Authorization header: `Authorization: Bearer <token>`
 *
 * This makes it work both with our client-side auth (where we pass the token
 * explicitly in the Authorization header) and with any future cookie-based flow.
 */
export async function getServerSession(request?: { headers: Headers }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  let accessToken: string | undefined

  // 1) Try to read from Authorization header (Bearer token)
  const authHeader = request?.headers.get('authorization') || request?.headers.get('Authorization')
  if (authHeader?.toLowerCase().startsWith('bearer ')) {
    accessToken = authHeader.slice(7).trim()
  }

  // 2) Fallback to cookie-based token
  if (!accessToken) {
    const cookieStore = await cookies()
    accessToken = cookieStore.get('sb-access-token')?.value
  }

  if (!accessToken) {
    return { user: null, session: null }
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  })

  const {
    data: { user, session },
  } = await supabase.auth.getUser()

  return { user, session }
}

/**
 * Server-side function to require authentication
 * Throws an error if user is not authenticated
 */
export async function requireAuth(request?: { headers: Headers }) {
  const { user, session } = await getServerSession(request)

  if (!user || !session) {
    throw new Error('Unauthorized')
  }

  return { user, session }
}

