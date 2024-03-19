import SupabaseProvider from '../supabase-provider'
import {type PropsWithChildren} from 'react'
import '../css/style.css'
import AppProvider from '../app-provider'
import Theme from '../theme-provider'
import {Inter} from 'next/font/google'
import ToastProvider from '../toast-provider'
import {ProtectedPage} from '@/components/ui/ProtectedPage'
import {getSession, getUserDetails} from '../supabase-server'
import ProgressBar from '@/components/ui/ProgressBar'
import {notFound} from 'next/navigation'
import {NextIntlClientProvider} from 'next-intl'
import {getMessages, unstable_setRequestLocale} from 'next-intl/server'
import {locales} from '@/i18n'

export const dynamic = 'force-dynamic'

const inter = Inter({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const meta = {
  siteName: 'Lit Data',
  title: 'Lit Data',
  description: 'Real Data. Real Time.',
  cardImage: '/images/og-lit-data.jpg',
  images: [
    {
      url: '/images/og-lit-data.jpg',
      width: 1200,
      height: 630,
    },
  ],
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: 'https://www.litdata.org/',
  type: 'website',
}

export const metadata = {
  metadataBase: new URL('https://www.litdata.org'),
  siteName: meta.siteName,
  title: meta.title,
  description: meta.description,
  cardImage: meta.cardImage,
  images: meta.images,
  robots: meta.robots,
  favicon: meta.favicon,
  url: meta.url,
  type: meta.type,
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  openGraph: {
    url: meta.url,
    title: meta.title,
    description: meta.description,
    cardImage: meta.cardImage,
    images: meta.images,
    type: meta.type,
    site_name: meta.title,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lit-data',
    title: meta.title,
    description: meta.description,
    cardImage: meta.cardImage,
    images: meta.images,
  },
}

interface RootLayoutProps extends PropsWithChildren {
  params: {locale: string}
}

export default async function RootLayout({children, params}: RootLayoutProps) {
  if (!locales.includes(params.locale as any)) notFound()
  const messages = await getMessages({locale: params.locale})

  unstable_setRequestLocale(params.locale)

  return (
    <html
      lang={params.locale}
      className={`${inter.variable} text-primary-500 antialiased`}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <SupabaseProvider>
            <Theme>
              <AppProvider>
                <ToastProvider>
                  <ProgressBar />
                  <ProtectedPage session={null} userDetails={null}>
                    <main id="skip" className="bg-primary-25">
                      {children}
                    </main>
                  </ProtectedPage>
                </ToastProvider>
              </AppProvider>
            </Theme>
          </SupabaseProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
