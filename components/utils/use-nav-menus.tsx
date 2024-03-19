import {useTranslations} from 'next-intl'
import {
  ChartBarSquareIcon,
  HomeIcon,
  ArrowPathIcon,
  HomeModernIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import {create} from 'zustand'

type Menu = {
  href: string
  label: any
  className?: string
  Icon: any
  children?: any[] | null
}

interface NavMenuProps {
  isHidden: boolean
  setHidden: (isHidden: boolean) => void
  toggleHidden: () => void
}

export const navMenuStore = create<NavMenuProps>()(set => ({
  isHidden: false,
  setHidden: (isHidden: boolean) => set({isHidden}),
  toggleHidden: () => set(state => ({isHidden: !state.isHidden})),
}))

function useNavMenus(type: 'client' | 'admin') {
  const t = useTranslations('Sidebar')
  if (type === 'client') {
    const menu: Menu[] = [
      {href: '/dashboard', label: t(`client-label-1`), Icon: HomeIcon},
      {
        href: '/reports',
        label: t(`client-label-2`),
        Icon: ChartBarSquareIcon,
      },
    ]
    return menu
  }

  if (type === 'admin') {
    const menu: Menu[] = [
      {href: '/dashboard', label: t(`admin-label-1`), Icon: HomeIcon, children: null},
      {href: '/users', label: t(`admin-label-2`), Icon: UsersIcon, children: null},
      {href: '/companies', label: t(`admin-label-3`), Icon: HomeModernIcon, children: null},
      {
        href: '/reports?limit=10&offset=0',
        label: t(`client-label-2`),
        Icon: ChartBarSquareIcon,
      },
      {href: '/sync-data', label: t(`admin-label-4`), Icon: ArrowPathIcon, children: null},
    ]

    return menu
  }
}

export default useNavMenus
