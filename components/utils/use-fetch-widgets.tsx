import {useSupabase} from '@/app/supabase-provider'
import {useUser} from './use-user'
import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import isAfter from 'date-fns/isAfter'

export const useFetchWidgets = () => {
  const {userDetails} = useUser()
  const {supabase} = useSupabase()
  const [data, setData] = useState<any>()

  const fetchWidgets = async () => {
    // && !isAfter(new Date(userDetails?.licence_expiry_date), new Date())
    if (userDetails) {
      // traer todos los widgets asociados al usuario
      try {
        // setIsLoading(true)
        // const notice = toast.loading('Loading widgets...')
        const {data: res, error} = await supabase
          .from('widgets')
          .select('*')
          .eq('associated_user', userDetails?.id)
        if (error) {
          // setIsLoading(false)
          // toast.update(notice, {
          //   render: error.message,
          //   type: 'error',
          //   isLoading: false,
          // })
          console.log(error.message)
        } else {
          // setIsLoading(false)
          // toast.update(notice, {
          //   render: 'Widgets loaded successfully',
          //   type: 'success',
          //   isLoading: false,
          //   autoClose: 500,
          // })
          setData(
            res
              .map(item => ({...item.widget_data, id: item.id}))
              .sort((a, b) => {
                // @ts-ignore
                return new Date(b.created_at) - new Date(a.created_at)
              }),
          )
        }
      } catch (error) {
        console.error('Error en la solicitud:', error)
      }
    }
  }

  useEffect(() => {
    // sincronizar los reportes (asociados al usuario) al cargar la pagina
    fetchWidgets()
  }, [userDetails])

  return {fetchWidgets, data, userDetails}
}
