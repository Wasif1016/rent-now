'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

function AuthCallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/vendor'
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      if (!code) {
        setError('No authorization code provided')
        setTimeout(() => {
          router.push('/auth/login?error=No authorization code provided')
        }, 2000)
        return
      }

      try {
        const supabase = createClient()
        const { error: exchangeError, data } = await supabase.auth.exchangeCodeForSession(code)
        
        if (exchangeError) {
          setError(exchangeError.message)
          setTimeout(() => {
            router.push(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`)
          }, 2000)
        } else {
          // Check user role and redirect accordingly
          const user = data?.session?.user
          const role = user?.user_metadata?.role
          
          if (role === 'admin') {
            router.push('/admin')
          } else {
            router.push('/vendor')
          }
          router.refresh()
        }
      } catch (err: any) {
        setError(err.message || 'Failed to complete authentication')
        setTimeout(() => {
          router.push(`/auth/login?error=${encodeURIComponent(err.message || 'Failed to complete authentication')}`)
        }, 2000)
      }
    }

    handleCallback()
  }, [code, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#10b981] border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Completing sign in...</p>
          </>
        )}
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#10b981] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Completing sign in...</p>
        </div>
      </div>
    }>
      <AuthCallbackInner />
    </Suspense>
  )
}

