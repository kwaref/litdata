'use client'
import {useEffect, type ReactElement} from 'react'
import {useUser} from '../utils/use-user'
import {redirect, usePathname, useRouter} from 'next/navigation'
import {type Session} from '@supabase/supabase-js'
import {useLocale} from 'next-intl'
import Cookies from 'js-cookie'
import {useSupabase} from '@/app/supabase-provider'
import isAfter from 'date-fns/isAfter'
import {getSession, getUserDetails} from '@/app/supabase-server'
import {surveyStore} from '../utils/use-survey'
import axios from 'axios'
import {error} from 'console'
import {toast} from 'react-toastify'
import {remove} from '../utils/storage'

interface ProtectedPageProps {
  children: ReactElement
  session: Session | null
  userDetails: any
}

const publicPaths = ['/not-found', '/signin', '/forgot-password', '/reset-password', '/404', '/500']

const adminPaths = [...publicPaths, '/users', '/companies', '/sync-data']
const clientPaths: string[] = []
const commonPaths = [...publicPaths, '/reports', '/dashboard', '/settings', '/widgets']

const roles: any = {
  client: [...commonPaths, ...clientPaths],
  admin: [...commonPaths, ...adminPaths],
}

export function ProtectedPage({children}: ProtectedPageProps) {
  const {saveSession, saveUserDetails, session, userDetails, configureUser, status} = useUser()
  const {saveLoading, loading, surveyData, saveSurveyData} = surveyStore()
  const pathname = usePathname()
  const locale = useLocale()
  const {supabase} = useSupabase()
  const {push} = useRouter()

  useEffect(() => {
    const removeSession = async () => {
      await supabase.auth.signOut().then(() => {
        saveUserDetails(null)
        saveSession(null)
        Cookies.remove('sb-access-token')
        Cookies.remove('sb-refresh-token')
        Cookies.remove('sb-type')
        Cookies.remove(process.env.NEXT_PUBLIC_SUPABSE_AUTH_COOKIE || '')
        push('/signin')
      })
    }

    if (!pathname.includes('/reset-password') && Cookies.get('sb-type') === 'recovery')
      removeSession()
  }, [])

  useEffect(() => {
    async function fetchSurveyData() {
      saveLoading(true)
      let notice: any = null
      if (
        (pathname.includes('/reports') && userDetails?.onboarding) ||
        !pathname.includes('/reports')
      ) {
        notice = toast.loading('Loading the survey data, it may take a while...')
      }

      try {
        const [surveyResult, axiosResult] = await Promise.all([
          supabase.from('survey_data_snap').select('data').single(),
          axios.get('/api/fetch-answers'),
        ])

        const {data: survey, error: surveyError} = surveyResult
        const {data: answers, status} = axiosResult

        if (surveyError || status !== 200) console.log('Error al traer la encuesta desde supabase')
        else {
          const newSurvey = {...survey.data.surveys[0], answers: answers.data}
          saveSurveyData(newSurvey)
        }
      } catch (error) {
        console.error(error)
      }
      saveLoading(false)
      if (
        (pathname.includes('/reports') && userDetails?.onboarding) ||
        !pathname.includes('/reports')
      ) {
        toast.update(notice, {
          render: 'Loading the survey data, it may take a while...',
          type: 'success',
          isLoading: false,
          autoClose: 500,
        })
      }
    }
    if (
      !loading &&
      !surveyData &&
      userDetails &&
      !publicPaths.map(path => `/${locale}${path}`).includes(pathname)
    ) {
      fetchSurveyData()
    }
  }, [pathname, userDetails])

  // useEffect(() => {
  //   async function saveUser() {
  //     const permissions = await getUserPermissions()
  //     saveUserDetails({...userDetails, permissions})
  //     saveSession(session)
  //   }
  //   saveUser()
  // }, [session, userDetails])

  // useEffect(() => {
  //   if ((!storedSession || !storedUserDetails) && session && status !== 'SIGNED_OUT') {
  //     saveSession(session)
  //     saveUserDetails(userDetails)
  //   }
  // }, [session, userDetails, router, storedUserDetails, storedSession])

  useEffect(() => {
    configureUser()
  }, [])

  useEffect(() => {
    if (!pathname.includes('/reports/filter') && !pathname.includes('/reports/crosstab'))
      remove('reportId')

    if (
      session &&
      userDetails?.licence_expiry_date &&
      !pathname.includes('/dashboard') &&
      isAfter(new Date(), new Date(userDetails?.licence_expiry_date))
    ) {
      redirect('/dashboard')
    }

    if (
      !Cookies.get(process.env.NEXT_PUBLIC_SUPABSE_AUTH_COOKIE || '') &&
      !publicPaths.map(path => `/${locale}${path}`).includes(pathname)
    )
      redirect('/signin')

    if (userDetails && !roles[userDetails?.role]?.some((path: string) => pathname.includes(path))) {
      redirect('/dashboard')
    }
  }, [pathname, session, publicPaths, userDetails])

  return children
}
