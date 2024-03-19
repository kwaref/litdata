import {useSupabase} from '@/app/supabase-provider'
import {useEffect, useState} from 'react'
import {useUser} from './use-user'

export function useFetchUsersHierarchy() {
  const {supabase} = useSupabase()
  const [data, setData] = useState<any>()
  const {userDetails} = useUser()

  const fetchUsersHierarchy = async () => {
    // traer todos los reportes asociados al usuario
    try {
      const {data: res, error} = await supabase.from('users').select('*')
      // .neq('id', userDetails?.id)
      if (error) {
        console.log(error.message)
      } else {
        // @ts-ignore
        const companies = res.filter(el => !!el?.is_company)

        // @ts-ignore
        const users = res.filter(el => !el?.is_company)

        const hierarchy = companies.map(company => ({
          id: company.id,
          full_name: company.full_name,
          // @ts-ignore
          permissions: company.allowed_questions,
          users: users
            .filter(
              // @ts-ignore
              user => user.company === company.id,
            )
            .sort((a, b) => {
              // @ts-ignore
              return new Date(b.created_at) - new Date(a.created_at)
            }),
        }))

        setData(hierarchy)
      }
    } catch (error) {
      console.error('Error en la solicitud:', error)
    }
  }

  useEffect(() => {
    // sincronizar los reportes (asociados al usuario) al cargar la pagina
    fetchUsersHierarchy()
  }, [])

  return {fetchUsersHierarchy, data}
}
