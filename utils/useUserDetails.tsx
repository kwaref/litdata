'use client'

import {useSupabase} from '@/app/supabase-provider'
import {useEffect, useState} from 'react'

const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState<any>(null)
  const {supabase} = useSupabase()

  useEffect(() => {
    const fetchUserDetails = async () => {
      const {data: sessionData} = await supabase.auth.getUser()
      const {data} = await supabase
        .from('users')
        .select(`*`)
        .eq('id', sessionData.user?.id)
        .single()
      if (data) setUserDetails(data)
    }
    fetchUserDetails()
  }, [])

  return {userDetails}
}

export default useUserDetails
