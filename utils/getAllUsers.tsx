import {createServerSupabaseClient, getUserDetails} from '@/app/supabase-server'
import toastAlert from './toastAlert'

const getAllUsers = async () => {
  const userDetails = await getUserDetails()
  const supabase = createServerSupabaseClient()

  let query = supabase
    .from('users')
    .select('*')
    .neq('id', userDetails?.id)

  if (userDetails?.role === 'admin') {
    query = query.eq('role', 'client')
  }

  const {data, error} = await query

  if (error) {
    toastAlert({message: error?.message, type: 'error'})
  }

  return {data, error}
}

export default getAllUsers
