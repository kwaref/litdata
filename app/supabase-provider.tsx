'use client'

import {useUser} from '@/components/utils/use-user'
import type {Database} from '@/types_db'
import {createPagesBrowserClient} from '@supabase/auth-helpers-nextjs'
import type {SupabaseClient} from '@supabase/auth-helpers-nextjs'
import {redirect, usePathname, useRouter} from 'next/navigation'
import {createContext, useContext, useEffect, useState} from 'react'
import Cookies from 'js-cookie'

type SupabaseContext = {
  supabase: SupabaseClient<Database>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({children}: {children: React.ReactNode}) {
  const [supabase] = useState(() => createPagesBrowserClient())
  const router = useRouter()
  const path = usePathname()
  const {status, saveUserDetails, saveSession, configureUser} = useUser()

  useEffect(() => {
    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange(async event => {
      if (event === 'TOKEN_REFRESHED') {
        configureUser()
      }
      // if (event === 'SIGNED_IN' && (!status || status === 'SIGNED_OUT')) {
      //   await configureUser(event, path.includes('/signin') ? router.push('/dashboard') : null)
      // }
      // if (event === 'SIGNED_OUT') {
      //   router.push('/signin')
      // }

      // if (event === 'SIGNED_IN' && path.includes('signin')) router.refresh()
      // if (event === 'SIGNED_IN' && path.includes('signin')) router.push('/')
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <Context.Provider value={{supabase}}>
      <>{children}</>
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }

  return context
}
