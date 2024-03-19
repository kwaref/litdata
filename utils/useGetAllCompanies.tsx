import {useSupabase} from '@/app/supabase-provider'
import {useEffect, useState} from 'react'

const useGetAllCompanies = () => {
  const {supabase} = useSupabase()
  const [companies, setCompanies] = useState([])

  useEffect(() => {
    const fetchCompanies = async () => {
      const {data, error} = await supabase.from('users').select('*').match({is_company: true})
      if (error) console.log(error.message)
      else {
        // @ts-ignore
        setCompanies([...data])
      }
    }
    fetchCompanies()
  }, [])

  return {companies}
}

export default useGetAllCompanies
