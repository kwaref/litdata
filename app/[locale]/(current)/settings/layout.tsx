'use client'

import {cn} from '@/components/utils/tailwindMerge'
import Link from 'next/link'
import {useSelectedLayoutSegments} from 'next/navigation'
import {type ReactNode, memo} from 'react'
import useToggle from '@/components/utils/useToggle'
import {useTranslations} from 'next-intl'
import {ChevronDoubleRightIcon, Cog6ToothIcon} from '@heroicons/react/24/outline'

interface SettingsLayoutProps {
  children: ReactNode
}

type Menu = {
  href: string
  label: string
  Icon: any
  children: any[] | null
}

function SettingsLayout({children}: SettingsLayoutProps) {
  const {isOpen, onToggle} = useToggle()
  const segments = useSelectedLayoutSegments()
  const t = useTranslations('Settings')

  const menu: Menu[] = [
    {href: '/settings/account', label: t('sideBar.myAccount'), Icon: Cog6ToothIcon, children: null},
  ]

  return (
    <>
      <div className="text-primary-500 h-full w-full px-4 py-6 sm:px-6 md:px-10">
        <h1 className="mb-6 text-3xl font-degular tracking-normal font-bold">{t('page-header')}</h1>
        <div className="flex max-md:flex-col min-h-[75dvh] w-full rounded border border-border bg-background">
          {/* <div
            className={cn(
              'max-h-[75dvh] min-h-[75dvh] w-0 overflow-hidden overflow-y-auto border-r border-border transition-all duration-300 dark:border-none sm:w-64',
              {'max-sm:w-64 ': isOpen},
            )}
          > */}
          <div className="md:max-h-[75dvh] md:min-h-[75dvh] overflow-hidden overflow-y-auto max-md:border-b md:border-r border-border transition-all duration-300 dark:border-none w-full md:w-64">
            <div className=" flex flex-col gap-4 p-5">
              <p className="text-primary-200 text-xs">{t('sideBar.settings')}</p>
              {menu?.map(({label, href, Icon}) => (
                <Link
                  key={label}
                  className={cn(
                    'w-fit md:w-full bg-primary-50 flex cursor-pointer items-center justify-start rounded px-2 py-1 shadow-sm',
                    {'bg-transparent shadow-none': !segments.includes(href.split('/')[2])},
                  )}
                  href={href}
                >
                  <Icon className="h-7 w-7 pr-2 max-sm:text-xl" /> {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="relative md:max-h-[75dvh] md:min-h-[75dvh] w-full overflow-hidden  overflow-y-auto px-3 py-6 sm:p-6">
            {/* <ChevronDoubleRightIcon
              className={cn('absolute left-2 top-3 h-6 w-6 cursor-pointer sm:hidden', {
                'rotate-180': isOpen,
              })}
              onClick={onToggle}
            /> */}
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(SettingsLayout)
