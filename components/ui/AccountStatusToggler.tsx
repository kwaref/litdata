import {useSupabase} from '@/app/supabase-provider'
import toastAlert from '@/utils/toastAlert'
import {useEffect, useState} from 'react'

const AccountStatusToggler = ({userId}: {userId: string}) => {
  const [toggle, setToggle] = useState(false)
  const [loading, setLoading] = useState(false)
  const {supabase} = useSupabase()

  useEffect(() => {
    const fetchAccountStatus = async () => {
      setLoading(true)
      const {data, error} = await supabase
        .from('users')
        .select('is_active')
        .eq('id', userId)
        .single()

      if (data) {
        if (data?.is_active !== toggle) setToggle(data?.is_active)
      }
      setLoading(false)
    }
    fetchAccountStatus()
  }, [userId])

  useEffect(() => {
    const updateAccountStatus = async () => {
      setLoading(true)
      const {data, error} = await supabase
        .from('users')
        // @ts-ignore
        .update({
          is_active: toggle,
        })
        .eq('id', userId)

      setLoading(false)
    }
    updateAccountStatus()
  }, [toggle])

  if (!userId) return <></>
  return (
    <div className="m-3 w-24">
      {/* Start */}
      <div className="flex items-center">
        <div className="form-switch">
          <input
            type="checkbox"
            id={`switch-$${userId}`}
            className="sr-only"
            disabled={loading}
            checked={toggle}
            onChange={() => setToggle(!toggle)}
          />
          <label className="bg-slate-400 dark:bg-slate-700" htmlFor={`switch-$${userId}`}>
            <span className="bg-white shadow-sm" aria-hidden="true"></span>
            <span className="sr-only">Switch label</span>
          </label>
        </div>
        <div className="ml-2 text-sm italic text-slate-400 dark:text-slate-500">
          {toggle ? 'Active' : 'Inactive'}
        </div>
      </div>
      {/* End */}
    </div>
  )
}

export default AccountStatusToggler
