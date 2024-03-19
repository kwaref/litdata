import {useEffect, useState, type ReactNode} from 'react'
import useDebounceFn from '../utils/use-debounceFn'
import {cn} from '../utils/tailwindMerge'
import {XMarkIcon} from '@heroicons/react/20/solid'
import Button from './ButtonCVA'

interface DrawerProps {
  header?: string | ReactNode
  children: any
  open: boolean
  onClose?: () => void
  onBackdropClose?: () => void
  classNames?: {
    base?: string
    container?: string
    content?: string
    header?: string
    backdrop?: string
  }
  direction?: 'right' | 'left'
}

function Drawer({
  header,
  children,
  open = false,
  onClose,
  onBackdropClose,
  classNames,
  direction = 'right',
}: DrawerProps) {
  const [unmountedChildren, setUnmountedChildren] = useState(false)

  const {run: unmount} = useDebounceFn(() => {
    setUnmountedChildren(true)
  })

  useEffect(() => {
    const body = document.getElementsByTagName('body')[0]
    if (open) {
      setUnmountedChildren(false)
      body.style.overflow = 'hidden'
    } else {
      unmount()
      body.style.overflow = 'auto'
    }
  }, [open])

  // if (unmountedChildren) return null

  return (
    <div
      className={cn(
        'fixed overflow-hidden z-[1199] bg-primary-900/40 inset-0 transform ease-in-out',
        {
          'transition-opacity opacity-100 duration-500': open,
          'transition-all delay-500 opacity-0': !open,
          'translate-x-0': open && direction === 'right',
          'translate-x-full': !open && direction === 'right',
          '-translate-x-0': open && direction === 'left',
          '-translate-x-full': !open && direction === 'left',
        },
        classNames?.base,
      )}
    >
      <div
        className={cn(
          'w-screen max-w-lg absolute bg-background dark:border dark:border-border h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform p-5',
          {
            'right-0': direction === 'right',
            'left-0': direction === 'left',
            'translate-x-0': open && direction === 'right',
            'translate-x-full': !open && direction === 'right',
            '-translate-x-0': open && direction === 'left',
            '-translate-x-full': !open && direction === 'left',
          },
          classNames?.container,
        )}
      >
        <header
          className={cn(
            'w-full flex justify-between items-baseline gap-2 mb-4',
            classNames?.header,
          )}
        >
          <h1 className="text-xl font-degular font-semibold">{header}</h1>
          {onClose && (
            <Button
              variant="link"
              color="inherit"
              className="p-0 text-primary-400"
              isIconOnly
              onClick={onClose}
            >
              <XMarkIcon className="w-5 h-5" />
            </Button>
          )}
        </header>
        {children}
      </div>
      {onBackdropClose && (
        <section
          className={cn('h-full w-screen', classNames?.backdrop)}
          onClick={onBackdropClose}
        ></section>
      )}
    </div>
  )
}

export default Drawer
