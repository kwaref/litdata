import {useSupabase} from '@/app/supabase-provider'
import React, {useState} from 'react'

const UserRoleSelect = ({value, userId}: {value: string; userId: string}) => {
  const {supabase} = useSupabase()
  const [loading, setLoading] = useState(false)

  const handleRoleChange = async (ev: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true)
    const {data, error} = await supabase
      .from('users')
      // @ts-ignore
      .update({
        role: ev.target.value,
      })
      .eq('id', userId)
    setLoading(false)
  }

  return (
    <>
      <select
        id="country"
        className="form-select w-full rounded-md border border-gray-300 p-2 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:focus:ring-blue-800"
        value={value}
        onChange={handleRoleChange}
        disabled={loading}
      >
        <option key={'client'} value={'client'}>
          Client
        </option>
        <option key={'admin'} value={'admin'}>
          Admin
        </option>
      </select>
    </>
  )
}

export default UserRoleSelect
