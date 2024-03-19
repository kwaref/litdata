import {type Database} from '@/types_db'
import toastAlert from '@/utils/toastAlert'
import {createServerComponentClient} from '@supabase/auth-helpers-nextjs'
import {cookies} from 'next/headers'
import {cache} from 'react'

export const createServerSupabaseClient = cache(() =>
  createServerComponentClient<Database>({cookies}),
)

export async function getSession() {
  const supabase = createServerSupabaseClient()
  try {
    const {
      data: {session},
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function getUserDetails() {
  const session = await getSession()
  const supabase = createServerSupabaseClient()
  try {
    const {data: userDetails} = await supabase
      .from('users')
      .select(`*`)
      .eq('id', session?.user.id)
      .single()

    // @ts-ignore
    if (!userDetails?.is_company && userDetails?.company) {
      const {data: companyDetails} = await supabase
        .from('users')
        .select('*')
        // @ts-ignore
        .eq('id', userDetails.company)
        .single()
      // @ts-ignore
      userDetails.licence_expiry_date = companyDetails.licence_expiry_date
    }
    return userDetails
  } catch (error: any) {
    toastAlert({message: error?.message, type: 'error'})
    return null
  }
}

export async function getSubscription() {
  const supabase = createServerSupabaseClient()
  try {
    const {data: subscription} = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .maybeSingle()
      .throwOnError()
    return subscription
  } catch (error: any) {
    toastAlert({message: error?.message, type: 'error'})
    return null
  }
}

export const getActiveProductsWithPrices = async () => {
  const supabase = createServerSupabaseClient()
  const {data, error} = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', {foreignTable: 'prices'})

  if (error) {
    toastAlert({message: error?.message, type: 'error'})
  }
  return data ?? []
}
