import {useSupabase} from '@/app/supabase-provider'
import {useUser} from '@/components/utils/use-user'
import {useEffect, useState} from 'react'
import toastAlert from './toastAlert'
import useGroupCompanies from './useGroupCompanies'

const useCompanies = () => {
  const {userDetails} = useUser()
  const {supabase} = useSupabase()
  const [companies, setCompanies] = useState<any[]>([])
  const {groups} = useGroupCompanies()

  useEffect(() => {
    const fetchCompanies = async () => {
      const {data, error} = await supabase
        .from('users')
        .select('*')
        .neq('id', userDetails?.id)
        .eq('role', 'client')
        .eq('is_company', true)

      if (error) {
        toastAlert({message: error?.message, type: 'error'})
        throw error
      } else {
        setCompanies(
          // data,
          data.map(company => ({
            ...company,
            group_id: {
              // @ts-ignore
              id: company?.group_id,
              // @ts-ignore
              title: groups.find(group => group?.id?.toString() === company?.group_id?.toString())
                ?.title,
            },
          })),
        )
      }
    }
    if (userDetails) fetchCompanies()
  }, [userDetails, groups])

  return {companies}
}

export default useCompanies
