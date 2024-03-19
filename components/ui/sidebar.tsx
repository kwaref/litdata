'use client'

import {getBreakpoint} from '../utils/utils'
import Logo from './logo'
import {useAppProvider} from '@/app/app-provider'
import {Transition} from '@headlessui/react'
import {useEffect, useRef, useState} from 'react'
import SidebarLink from '@/components/ui/sidebar-link'
import SidebarLinkGroup from '@/components/ui/sidebar-link-group'
import {cn} from '@/components/utils/tailwindMerge'
import {useSelectedLayoutSegments} from 'next/navigation'
import {ChevronRightIcon, XMarkIcon} from '@heroicons/react/20/solid'
import {useUser} from '../utils/use-user'
import {useTranslations} from 'next-intl'
import {ChevronDoubleRightIcon} from '@heroicons/react/24/outline'

import useNavMenus from '@/components/utils/use-nav-menus'

export default function Sidebar() {
  const {userDetails} = useUser()
  const userRole = userDetails?.role || 'client'
  const sidebar = useRef<HTMLDivElement>(null)
  const {sidebarOpen, setSidebarOpen} = useAppProvider()
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true)
  const [breakpoint, setBreakpoint] = useState<string | undefined>(getBreakpoint())
  const expandOnly = !sidebarExpanded && (breakpoint === 'lg' || breakpoint === 'xl')
  const t = useTranslations('Sidebar')
  const segments = useSelectedLayoutSegments()
  const menu = useNavMenus(userRole)

  // close on click outside
  useEffect(() => {
    const clickHandler = ({target}: {target: EventTarget | null}): void => {
      if (!sidebar.current) return
      if (!sidebarOpen || sidebar.current.contains(target as Node)) return
      setSidebarOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({keyCode}: {keyCode: number}): void => {
      if (!sidebarOpen || keyCode !== 27) return
      setSidebarOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  const handleBreakpoint = () => {
    const bp = getBreakpoint()
    setBreakpoint(bp)
    if (bp === 'lg') {
      setSidebarExpanded(false)
    }
    if (bp === 'xl' || bp === '2xl') {
      setSidebarExpanded(true)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleBreakpoint)
    return () => {
      window.removeEventListener('resize', handleBreakpoint)
    }
  }, [breakpoint])

  return (
    <div className={`min-w-fit ${sidebarExpanded ? 'sidebar-expanded' : ''}`}>
      {/* Sidebar backdrop (mobile only) */}
      <Transition
        className="fixed inset-0 z-[1200] bg-slate-900/50 lg:z-auto lg:hidden"
        show={sidebarOpen}
        enter="transition-opacity ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-out duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        aria-hidden="true"
      />

      {/* Sidebar */}
      <Transition
        show={sidebarOpen}
        unmount={false}
        as="div"
        id="sidebar"
        ref={sidebar}
        // className="no-scrollbar bg-primary-25 absolute left-0 top-0 z-40 flex h-[100dvh] w-64 shrink-0 flex-col overflow-y-scroll p-4 transition-all duration-200 ease-in-out lg:static lg:left-auto lg:top-auto  lg:!flex lg:w-20 lg:translate-x-0 lg:overflow-y-auto lg:sidebar-expanded:!w-64"
        className="no-scrollbar bg-primary-25 absolute left-0 top-0 z-[1200] flex h-[100dvh] w-64 shrink-0 flex-col overflow-y-scroll p-4 transition-all duration-200 ease-in-out"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        {/* Sidebar header */}
        <div className="mb-8 flex items-center justify-between pr-3 sm:px-2">
          {/* Close button */}
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <XMarkIcon className="text-primary-500 h-6 w-6" />
          </button>
          {/* Logo */}
          <Logo />
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-primary-200 pl-1.5 text-xs font-semibold uppercase">
              <span className="w-6 text-center" aria-hidden="true">
                {t('span-title')}
              </span>
            </h3>
            {/* sidebar links */}
            <ul className="mt-2">
              {menu?.map(({href, Icon, label, className}) => (
                <SidebarLinkGroup
                  key={label}
                  className={cn({
                    'bg-primary-50 rounded-md': segments.includes(href.split('/')[1]),
                  })}
                >
                  {() => (
                    <SidebarLink href={href}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Icon className={cn('h-6 w-6', className)} />
                          <span className="text-sm font-medium duration-200 dark:lg:opacity-0 dark:lg:sidebar-expanded:opacity-100 dark:2xl:opacity-100">
                            {label}
                          </span>
                        </div>
                        {/* Icon */}
                        <ChevronRightIcon className={cn('h-5 w-5')} />
                      </div>
                    </SidebarLink>
                  )}
                </SidebarLinkGroup>
              ))}
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        {/* <div className="mt-auto hidden justify-end pt-3 lg:inline-flex">
          <div className="px-3 py-2">
            <button
              className="text-primary-500"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
            >
              <span className="sr-only">Expand / collapse sidebar</span>
              <ChevronDoubleRightIcon className="h-5 w-5 sidebar-expanded:rotate-180" />
            </button>
          </div>
        </div> */}
      </Transition>
    </div>
  )
}
