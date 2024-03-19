'use client'
import toastAlert from '@/utils/toastAlert'
import {createPagesBrowserClient} from '@supabase/auth-helpers-nextjs'
import {type Subscription, type Session} from '@supabase/supabase-js'
import {usePathname, useRouter} from 'next/navigation'
import {useState} from 'react'
import {create} from 'zustand'
import Cookies from 'js-cookie'

interface UserStoreProps {
  session: Session | null
  userDetails: any
  status: string
  saveSession: (session: Session | null) => void
  saveUserDetails: (userDetails: any) => void
  saveStatus: (userDetails: any) => void
}

export const userStore = create<UserStoreProps>()(set => ({
  session: null,
  userDetails: null,
  status: '',
  saveSession: (session: Session | null) => set({session}),
  saveUserDetails: (userDetails: any) => set({userDetails}),
  saveStatus: (status: any) => set({status}),
}))

export function useUser() {
  const [supabase] = useState(() => createPagesBrowserClient())
  const {push} = useRouter()
  const path = usePathname()
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [errorMessage, setError] = useState<any>(false)

  const session = userStore(state => state.session)
  const userDetails = userStore(state => state.userDetails)
  const status = userStore(state => state.status)

  const saveSession = userStore(state => state.saveSession)
  const saveUserDetails = userStore(state => state.saveUserDetails)
  const saveStatus = userStore(state => state.saveStatus)

  const getUserPermissions = async (userDetails: any, supabase: any) => {
    if (userDetails?.role === 'admin') return {permissions: [], licence_expiry_date: ''}
    if (userDetails?.is_company) {
      return {
        permissions: userDetails?.allowed_questions ?? [],
        licence_expiry_date: userDetails?.licence_expiry_date,
      }
    } else {
      const {data, error} = await supabase
        .from('users')
        .select('allowed_questions, licence_expiry_date')
        .eq('id', userDetails?.company)
        .single()
      if (!error) {
        return {
          permissions: data?.allowed_questions ?? [],
          licence_expiry_date: data?.licence_expiry_date ?? '',
        }
      }
      return {}
    }
  }

  const signIn = async function signInWithEmail({
    email,
    password,
  }: {
    email: string
    password: string
  }) {
    setIsSubmiting(true)

    const {
      data: {user, session},
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // toastAlert({message: error.message, type: 'error'})
      setError(error.message)
      setIsSubmiting(false)
      return
    }

    const {data: userDetails} = await supabase
      .from('users')
      .select(`*`)
      .eq('id', session?.user.id)
      .single()
    setError('')
    const {permissions, licence_expiry_date} = await getUserPermissions(userDetails, supabase)
    saveUserDetails({
      ...userDetails,
      permissions: permissions ?? [],
      licence_expiry_date: licence_expiry_date ?? '',
    })
    saveSession(session)
    setIsSubmiting(false)
    push('/dashboard')
  }

  const configureUser = async (event?: string, redirect?: any) => {
    if (Cookies.get(process.env.NEXT_PUBLIC_SUPABSE_AUTH_COOKIE || '')) {
      const {
        data: {session},
        error,
      } = await supabase.auth.getSession()

      if (session) {
        const {data: userDetails} = await supabase
          .from('users')
          .select(`*`)
          .eq('id', session?.user.id)
          .single()

        // saveStatus(event || 'SIGNED_IN')
        const {permissions, licence_expiry_date} = await getUserPermissions(userDetails, supabase)
        saveUserDetails({
          ...userDetails,
          permissions: permissions ?? [],
          licence_expiry_date: licence_expiry_date ?? '',
        })
        saveSession(session)
        // redirect?.()
      } else {
        push('/signin')
        // saveStatus('SIGNED_OUT')
      }
    }
  }

  return {
    session,
    userDetails,
    status,
    saveSession,
    saveUserDetails,
    saveStatus,
    configureUser,
    signIn,
    isSubmiting,
    errorMessage,
  }
}
