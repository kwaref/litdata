import {type AnchorHTMLAttributes, type MouseEvent, type ReactNode} from 'react'
import {reportStore} from '../utils/use-reports'
import {useRouter} from 'next/navigation'
import {cn} from '../utils/tailwindMerge'

interface LinkMenuProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: ReactNode
}

const message =
  'Unsaved report!. Exit without saving will discard your report filters. Are you sure want to leave this page?'

function LinkMenu({children, href, className, onClick, ...props}: LinkMenuProps) {
  const router = useRouter()
  const isDirty = reportStore(state => state.isDirty)
  const setIsDirty = reportStore(state => state.setIsDirty)

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    if (!isDirty) {
      onClick?.(e)
      router.push(href)
      return
    }

    // Perform actions before route change, such as showing a confirmation dialog
    if (!window.confirm(message)) return

    setIsDirty(false)
    onClick?.(e)
    router.push(href)
  }

  return (
    <a {...props} className={cn('cursor-pointer', className)} onClick={handleClick}>
      {children}
    </a>
  )
}

export default LinkMenu
