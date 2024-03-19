'use client'

import {useSupabase} from '@/app/supabase-provider'
import {cn} from '@/components/utils/tailwindMerge'
import {useUser} from '@/components/utils/use-user'
import {Menu, Transition} from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {useTranslations} from 'next-intl'
import {ChevronDownIcon} from '@heroicons/react/20/solid'
import Cookies from 'js-cookie'

export default function DropdownProfile({align}: {align?: 'left' | 'right'}) {
  const {supabase} = useSupabase()
  const router = useRouter()
  const {userDetails, saveUserDetails, saveSession, saveStatus} = useUser()
  const [avatarUrl, setAvatarUrl] = useState('')
  const t = useTranslations('Navbar')

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
        {userDetails && (
          <>
            <div
              className={cn(
                'bg-secondary-50 text-secondary-700 flex h-8 w-8 items-center justify-center rounded-full text-center text-sm font-semibold',
                {'bg-primary-50 text-primary-500': userDetails?.role === 'admin'},
              )}
            >
              {userDetails?.is_company
                ? `${userDetails?.primary_contact
                    ?.split(' ')?.[0]
                    ?.charAt(0)}${userDetails?.primary_contact?.split(' ')?.[1]?.charAt(0)}`
                : `${userDetails?.full_name?.split(' ')?.[0]?.charAt(0)}${userDetails?.full_name
                    ?.split(' ')?.[1]
                    ?.charAt(0)}`}
            </div>
            <div className="text-white flex items-center gap-1.5 truncate">
              <span className="ml-2 truncate text-sm font-semibold">
                {userDetails?.is_company
                  ? userDetails?.primary_contact?.split(' ')?.[0]
                  : userDetails?.full_name?.split(' ')?.[0]}
              </span>
              <ChevronDownIcon className="h-5 w-5" />
            </div>
          </>
        )}
      </Menu.Button>
      <Transition
        className={`absolute top-full z-10 mt-1 min-w-[11rem] origin-top-right overflow-hidden rounded border border-border bg-background py-2 px-4 shadow-lg  ${
          align === 'right' ? 'right-0' : 'left-0'
        }`}
        enter="transition ease-out duration-200 transform"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="border-b border-border pb-2 mb-2">
          {/* <div className="text-primary-500 text-sm font-medium">{userDetails?.username || ''}</div> */}
          <div className="text-primary-200 text-xs capitalize">{userDetails?.role}</div>
        </div>
        <Menu.Items as="ul" className="font-medium  focus:outline-none">
          <Menu.Item as="li">
            {({active}) => (
              <Link
                href={'/settings'}
                className={cn('text-secondary-600 flex items-center py-1 text-sm', {
                  'text-secondary-700': active,
                })}
              >
                {t('button-settings')}
              </Link>
            )}
          </Menu.Item>
          <Menu.Item as="li">
            {({active}) => (
              <button
                onClick={async e => {
                  e.preventDefault()
                  await supabase.auth.signOut().then(() => {
                    saveUserDetails(null)
                    saveSession(null)
                    saveStatus('SIGNED_OUT')
                    Cookies.remove('sb-access-token')
                    Cookies.remove('sb-refresh-token')
                    Cookies.remove(process.env.NEXT_PUBLIC_SUPABSE_AUTH_COOKIE || '')
                    router.push('/signin')
                    // router.refresh()
                  })
                }}
                className={cn('text-secondary-600 flex items-center py-1 text-sm', {
                  'text-secondary-700': active,
                })}
              >
                {t('button-logout')}
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
