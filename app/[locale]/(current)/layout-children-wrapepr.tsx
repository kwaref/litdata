'use client'

import {cn} from '@/components/utils/tailwindMerge'
import {navMenuStore} from '@/components/utils/use-nav-menus'
import {usePathname} from 'next/navigation'

export default function LayoutChildrenWrapper({
  children,
  params,
}: {
  children: React.ReactNode
  params: {id: string}
}) {
  const pathname = usePathname()
  const isHidden = navMenuStore(state => state.isHidden)

  return (
    <div
      className={cn(
        '[&>*:first-child]:scroll-mt-16 w-full flex 2xl:justify-center min-h-[calc(100dvh-3rem overflow-auto',
        {'max-h-[calc(100dvh-3rem)]': !isHidden},
        {
          // '': pathname?.includes('reports') && params?.id,
        },
      )}
    >
      <div
        className={cn(
          'w-full grid grid-cols-4 sm:grid-cols-12 2xl:min-w-[1471px] 2xl:max-w-[1471px]',
          {
            '!max-w-[100%]': pathname?.includes('/reports') && pathname.split('/').length > 3,
          },
        )}
      >
        <main className="col-span-full ">{children}</main>
      </div>
    </div>
  )
}
