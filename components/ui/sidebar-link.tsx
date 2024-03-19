import {usePathname, useSelectedLayoutSegments} from 'next/navigation'
import {useAppProvider} from '@/app/app-provider'
import {cn} from '../utils/tailwindMerge'
import LinkMenu from './LinkMenu'

interface SidebarLinkProps {
  children: React.ReactNode
  href: string
}

export default function SidebarLink({children, href}: SidebarLinkProps) {
  const segments = useSelectedLayoutSegments()
  const {setSidebarOpen} = useAppProvider()

  return (
    <LinkMenu
      className={cn(
        'text-primary-500 block truncate transition duration-150 dark:text-slate-200 dark:hover:text-white dark:group-[.is-link-group]:text-slate-400 dark:hover:group-[.is-link-group]:text-slate-200',
        {
          'dark:group-[.is-link-group]:text-indigo-500': segments.includes(href.split('/')[1]),
        },
      )}
      href={href}
      onClick={() => setSidebarOpen(false)}
    >
      {children}
    </LinkMenu>
  )
}
