import {Transition, Dialog as DialogUI} from '@headlessui/react'
import {type ReactNode, memo, Fragment} from 'react'
import {cn} from '../utils/tailwindMerge'
import {XMarkIcon} from '@heroicons/react/20/solid'

interface DialogProps {
  title?: string
  isOpen: boolean
  children: ReactNode
  closeDialog?: () => void
  classNames?: {
    container?: string
    panel?: string
    title?: string
  }
}

function Dialog({
  isOpen,
  children,
  title,
  closeDialog = () => {},
  classNames,
  ...props
}: DialogProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <DialogUI as="div" className="relative z-[1199]" onClose={closeDialog} {...props}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-primary-900/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogUI.Panel
                className={cn(
                  'text-primary-500 overflow-hidden rounded-md bg-background text-left align-middle shadow-xl transition-all max-md:w-5/6  max-xs:w-full',
                  classNames?.panel,
                )}
              >
                {title && (
                  <DialogUI.Title
                    as="h3"
                    className={cn(
                      'text-primary-500 flex w-full items-center gap-2 justify-between text-lg font-degular tracking-normal font-semibold leading-6',
                      classNames?.title,
                    )}
                  >
                    {title}
                    {closeDialog && (
                      <XMarkIcon
                        className="text-primary-300 hover:text-primary-400 h-5 w-5 cursor-pointer"
                        onClick={closeDialog}
                      />
                    )}
                  </DialogUI.Title>
                )}
                {children}
              </DialogUI.Panel>
            </Transition.Child>
          </div>
        </div>
      </DialogUI>
    </Transition>
  )
}

export default memo(Dialog)
