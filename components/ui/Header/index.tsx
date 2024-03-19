'use client'

import {useAppProvider} from '@/app/app-provider'
import {useUser} from '../../utils/use-user'
import {Bars3Icon, ChevronRightIcon} from '@heroicons/react/20/solid'
import useNavMenus, {navMenuStore} from '../../utils/use-nav-menus'
import LogoLight from '../logo-light'
import DropdownProfile from './dropdown-profile'
import {cn} from '@/components/utils/tailwindMerge'
import {getBreakpoint} from '@/components/utils/utils'
import {Fragment, useEffect, useState} from 'react'
import {useSupabase} from '@/app/supabase-provider'
import toastAlert from '@/utils/toastAlert'
import {usePathname, useRouter} from 'next/navigation'
import {QuestionMarkCircleIcon} from '@heroicons/react/24/outline'
import Button from '../ButtonCVA'
import {create} from 'zustand'
import {toast} from 'react-toastify'
import LinkMenu from '../LinkMenu'

interface HelpStoreProps {
  help: string
  setHelp: (help: string) => void
}

export const userHelp = create<HelpStoreProps>()(set => ({
  help: '',
  setHelp: (help: string) => set({help}),
}))

interface HeaderProps {
  userRole: string
}

export default function Header() {
  const {userDetails, saveUserDetails} = useUser()
  const userRole = userDetails?.role || 'client'
  const {sidebarOpen, setSidebarOpen} = useAppProvider()
  const menu = useNavMenus(userRole)
  const isHidden = navMenuStore(state => state.isHidden)
  const setHidden = navMenuStore(state => state.setHidden)
  const [breakpoint, setBreakpoint] = useState<string | undefined>(getBreakpoint())
  const {supabase} = useSupabase()
  const {refresh} = useRouter()
  const path = usePathname()
  const help = userHelp(state => state.help)

  const handleBreakpoint = () => {
    const bp = getBreakpoint()
    setBreakpoint(bp)

    if (bp === 'md') {
      setHidden(false)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleBreakpoint)
    return () => {
      window.removeEventListener('resize', handleBreakpoint)
    }
  }, [breakpoint])

  const updateUser = async () => {
    const notice = toast.loading('Loading coachmarks...')
    const {error} = await supabase
      .from('users')
      // @ts-ignore
      .update({
        [help]: false,
      })
      .eq('id', userDetails?.id)

    if (error) toastAlert({message: error.message, type: 'error'})
    else {
      toast.update(notice, {
        render: 'Loading coachmarks...',
        type: 'success',
        isLoading: false,
        autoClose: 500,
      })
      // supabase.auth.refreshSession()
      saveUserDetails({...userDetails, [help]: false})
      // refresh()
    }
  }

  return (
    <header className={cn('sticky top-0 z-[1100] bg-primary-900', {hidden: isHidden})}>
      <div className="px-4 sm:px-7">
        <div className="-mb-px flex h-16 items-center justify-between">
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="text-white lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => {
                setSidebarOpen(!sidebarOpen)
              }}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-5 w-5" />
            </button>
            <div className="max-lg:hidden flex gap-7">
              <LogoLight />
              <div className={cn('flex gap-7', {hidden: !userDetails})}>
                {menu?.map(({href, Icon, label, className}) => (
                  <LinkMenu key={label} href={href} className="flex items-center text-white">
                    <Icon
                      className={cn('h-5 w-5', className, {
                        'text-secondary-600': path?.includes(href?.split('?')[0]),
                      })}
                    />
                    <span
                      className={cn('ml-2 text-sm', {
                        'text-secondary-600': path?.includes(href?.split('?')[0]),
                      })}
                    >
                      {label}
                    </span>
                  </LinkMenu>
                ))}
              </div>
            </div>
          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            {/* <Notifications align="right" /> */}
            {/* <DropdownHelp align="right" /> */}
            {/* <ThemeToggle /> */}
            {path?.includes('/reports') && (
              <>
                <Button
                  isIconOnly
                  className={cn(
                    'bg-primary-50 hover:bg-white text-primary-500 hover:text-primary-500 h-8 w-8 rounded-full p-0',
                    {'onboarding-step-0': userDetails && !userDetails?.onboarding},
                  )}
                  startIcon={<QuestionMarkCircleIcon className="w-5 h-5" />}
                  onClick={updateUser}
                />
                {/* Divider */}
                <hr className="h-6 w-px border-none bg-border" />
              </>
            )}
            <DropdownProfile align="right" />
          </div>
        </div>
      </div>
    </header>
  )
}
