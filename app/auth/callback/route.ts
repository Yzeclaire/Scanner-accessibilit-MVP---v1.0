import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  console.log('🔍 Callback reçu:', {
    code: code ? 'PRESENT' : 'ABSENT',
    origin: requestUrl.origin,
    fullUrl: requestUrl.href
  })

  if (code) {
    const supabase = createRouteHandlerClient({ cookies: () => cookies() })
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        console.error('❌ Auth error:', error.message)
        return NextResponse.redirect(requestUrl.origin + '/auth/login?error=auth_failed')
      }
      console.log('✅ Session créée avec succès')
    } catch (error) {
      console.error('❌ Callback error:', error)
      return NextResponse.redirect(requestUrl.origin + '/auth/login?error=callback_error')
    }
  }

  // Redirection dashboard
  const dashboardUrl = new URL('/dashboard', requestUrl.origin)
  console.log('🔄 Redirection vers:', dashboardUrl.href)
  
  return NextResponse.redirect(dashboardUrl)
}
