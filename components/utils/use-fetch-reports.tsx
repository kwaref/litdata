import {useSupabase} from '@/app/supabase-provider'
import {useUser} from './use-user'
import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import isAfter from 'date-fns/isAfter'
import toastAlert from '@/utils/toastAlert'
import {usePagination} from './use-pagination'
import {usePathname} from 'next/navigation'

export function useFetchReports() {
  const {userDetails} = useUser()
  const {supabase} = useSupabase()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<any>()
  const path = usePathname()
  const arr = path.split('/')
  const enabled = arr[arr.length - 1] === 'reports'
  const {limit, offset} = usePagination(enabled)

  const fetchReports = async () => {
    if (userDetails && !isAfter(new Date(), new Date(userDetails?.licence_expiry_date))) {
      // traer todos los reportes asociados al usuario
      try {
        // const newList: any[] = []
        // const notice = toast.loading('Loading reports...')
        const query = () =>
          supabase
            .from('reports')
            .select('*')
            .or(`user_id.eq.${userDetails?.id}, allowed_users.cs.{${userDetails?.id}}`)
            .order('created_at', {ascending: false})

        const {data: res, error} = !enabled
          ? await query()
          : await query().range(offset * limit, offset * limit + limit)

        if (error) {
          // toast.update(notice, {
          //   render: error.message,
          //   type: 'error',
          //   isLoading: false,
          // })
          toastAlert({message: error.message, type: 'error'})
          console.log(error.message)
        } else {
          const newList = await Promise.all(
            res.map(async report => {
              const {data: ownerData, error} = await supabase
                .from('users')
                .select('*')
                .eq('id', report?.user_id)
                .single()

              return {
                ...report,
                ownerData,
              }
            }),
          )

          setData(newList)

          // toast.update(notice, {
          //   render: 'Load successfull',
          //   type: 'success',
          //   isLoading: false,
          //   autoClose: 500,
          // })
        }
      } catch (error) {
        console.error('Error en la solicitud:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    // sincronizar los reportes (asociados al usuario) al cargar la pagina
    fetchReports()
  }, [userDetails, limit, offset, enabled])

  return {fetchReports, data, userDetails, isLoading}
}
