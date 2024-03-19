import {useSupabase} from '@/app/supabase-provider'
import {useUser} from '@/components/utils/use-user'
import {useEffect, useState} from 'react'
import toastAlert from './toastAlert'
import useCompanies from './useCompanies'

const useGetOneUser = (id: string | number) => {
  // const {companies} = useCompanies()
  const {supabase} = useSupabase()
  const [user, setUser] = useState<any>([])

  useEffect(() => {
    const fetchUser = async () => {
      const {data, error} = await supabase.from('users').select('*').eq('id', id).single()

      if (error) {
        toastAlert({message: error?.message, type: 'error'})
        throw error
      } else {
        setUser({
          ...data,
          // company: {
          //   // @ts-ignore
          //   id: user?.company,
          //   full_name: companies.find(
          //     // @ts-ignore
          //     company => company?.id?.toString() === user?.company?.toString(),
          //   )?.full_name,
          // },
        })
      }
    }
    if (id) fetchUser()
  }, [id])

  return {user}
}

export default useGetOneUser
