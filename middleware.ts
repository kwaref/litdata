import {createMiddlewareClient} from '@supabase/auth-helpers-nextjs'
import createIntlMiddleware from 'next-intl/middleware'

import type {NextRequest} from 'next/server'
import type {Database} from '@/types_db'
import {locales} from './i18n'

export default async function middleware(req: NextRequest) {
  // const res = NextResponse.next()

  const handleI18nRouting = createIntlMiddleware({
    locales,
    defaultLocale: 'en',
    localeDetection: false,
  })
  const res = handleI18nRouting(req)

  const supabase = createMiddlewareClient<Database>({req, res})
  await supabase.auth.getSession()

  return res
}

export const config = {
  // Skip all paths that should not be internationalized. This example skips
  // certain folders and all pathnames with a dot (e.g. favicon.ico)
  matcher: ['/((?!api|_next/static|_next|_vercel|auth|.*\\..*).*)'],
}
