'use client'

import { usePathname } from 'next/navigation'
import { SeoFooter } from '@/components/home/seo-footer'

export function FooterWrapper() {
  const pathname = usePathname()
  
  // Don't show footer on admin or vendor dashboard pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/vendor')) {
    return null
  }
  
  return <SeoFooter />
}
