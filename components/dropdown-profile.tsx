'use client'

import {useSupabase} from '@/app/supabase-provider'
import useUserDetails from '@/utils/useUserDetails'
import {Menu, Transition} from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {FaUser} from 'react-icons/fa'
import {useUser} from './utils/use-user'

export default function DropdownProfile({align}: {align?: 'left' | 'right'}) {
  const {supabase} = useSupabase()
  const router = useRouter()

  const {userDetails} = useUser()
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    const getImageURL = async () => {
      const {data: avatarData} = await supabase.storage
        .from('storage')
        .getPublicUrl(userDetails?.avatar_url)
      if (avatarData) setAvatarUrl(avatarData.publicUrl)
    }
    if (userDetails?.avatar_url) getImageURL()
  }, [userDetails])

  return (
    <Menu as="div" className="relative inline-flex">
      <Menu.Button className="group inline-flex items-center justify-center">
        {avatarUrl ? (
          <Image
            className="h-8 w-8 rounded-full"
            src={avatarUrl}
            width={32}
            height={32}
            alt="User"
          />
        ) : (
          // <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-500 text-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-500 bg-gray-400 font-semibold text-primary">
            <FaUser />
          </div>
        )}
        <div className="flex items-center truncate">
          <span className="ml-2 truncate text-sm font-medium group-hover:text-slate-800 dark:text-slate-300 dark:group-hover:text-slate-200">
            {userDetails?.full_name}
          </span>
          <svg className="ml-1 h-3 w-3 shrink-0 fill-current text-slate-400" viewBox="0 0 12 12">
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </Menu.Button>
      <Transition
        className={`absolute top-full z-10 mt-1 min-w-[11rem] origin-top-right overflow-hidden rounded border border-slate-200 bg-white py-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800 ${
          align === 'right' ? 'right-0' : 'left-0'
        }`}
        enter="transition ease-out duration-200 transform"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="mb-1 border-b border-slate-200 px-3 pb-2 pt-0.5 dark:border-slate-700">
          <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
            {userDetails?.username || ''}
          </div>
          <div className="text-xs capitalize italic text-slate-500 dark:text-slate-400">
            {userDetails?.role}
          </div>
        </div>
        <Menu.Items as="ul" className="focus:outline-none">
          <Menu.Item as="li">
            {({active}) => (
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push('/signin')
                }}
                className={`flex items-center px-3 py-1 text-sm font-medium ${
                  active ? 'text-indigo-600 dark:text-indigo-400' : 'text-indigo-500'
                }`}
              >
                Sign Out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
