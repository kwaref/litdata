import {useSupabase} from '@/app/supabase-provider'
import {useUser} from '@/components/utils/use-user'
import {useEffect, useState} from 'react'
import toastAlert from './toastAlert'

const useGroupCompanies = () => {
  const {supabase} = useSupabase()
  const [groups, setGroups] = useState<any[]>([])

  useEffect(() => {
    const fetchGroups = async () => {
      const {data, error} = await supabase.from('groups').select('*')

      if (error) {
        toastAlert({message: error?.message, type: 'error'})
        throw error
      } else {
        setGroups(data)
      }
    }
    fetchGroups()
  }, [])

  return {groups}
}

export default useGroupCompanies
