import {useState} from 'react'
import {cn} from '../utils/tailwindMerge'

interface SidebarLinkGroupProps {
  children: (handleClick: () => void, openGroup: boolean) => React.ReactNode
  open?: boolean
  className?: string
}

export default function SidebarLinkGroup({
  children,
  open = false,
  className,
}: SidebarLinkGroupProps) {
  const [openGroup, setOpenGroup] = useState<boolean>(open)

  const handleClick = () => {
    setOpenGroup(!openGroup)
  }

  return (
    <li
      className={cn(
        'is-link-group text-primary-500 group mb-2 rounded px-3 py-2.5 last:mb-0',
        {
          'text-primary-50 dark:bg-slate-900': open,
        },
        className,
      )}
    >
      {children(handleClick, openGroup)}
    </li>
  )
}
