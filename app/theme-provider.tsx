'use client'

import {ThemeProvider} from 'next-themes'

export default function Theme({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      defaultTheme="ligth"
      themes={['ligth']}
    >
      {children}
    </ThemeProvider>
  )
}
