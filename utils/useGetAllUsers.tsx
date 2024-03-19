import {useSupabase} from '@/app/supabase-provider'
import {useUser} from '@/components/utils/use-user'
import {useEffect, useState} from 'react'
import toastAlert from './toastAlert'
import useCompanies from './useCompanies'

const useGetAllUsers = () => {
  const {userDetails} = useUser()
  const {companies} = useCompanies()
  const {supabase} = useSupabase()
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const {data, error} = await supabase
        .from('users')
        .select('*')
        .neq('id', userDetails?.id)
        .eq('role', 'client')
        .eq('is_company', false)
        .order('created_at', {ascending: false})

      if (error) {
        toastAlert({message: error?.message, type: 'error'})
        throw error
      } else {
        setUsers(
          data.map(user => ({
            ...user,
            company: {
              // @ts-ignore
              id: user?.company,
              full_name: companies.find(
                // @ts-ignore
                company => company?.id?.toString() === user?.company?.toString(),
              )?.full_name,
            },
          })),
        )
      }
    }
    if (userDetails) fetchUsers()
  }, [userDetails, companies])

  return {users}
}

export default useGetAllUsers
