'use client'

import {Menu, Transition} from '@headlessui/react'
import {useTranslations} from 'next-intl'
import {cn} from '@/components/utils/tailwindMerge'
import Link from 'next/link'
import {EllipsisHorizontalIcon} from '@heroicons/react/20/solid'
import {useRef} from 'react'

export default function UsersTableItemMenu({
  align,
  placement = 'bottom',
  user,
  className = '',
  options,
}: React.HTMLAttributes<HTMLDivElement> & {
  align?: 'left' | 'right'
  placement?: 'top' | 'bottom' | 'center'
  user: any
  options: Array<{
    label: string
    Icon: any
    isLink?: boolean
    showDivider?: boolean
    href?: string
    onClick?: () => void
  }>
  className?: string
}) {
  const triggerRef = useRef<any>(null)
  const listRef = useRef<any>(null)
  return (
    <>
      <Menu as="div" className={cn('flex w-28 justify-end', className)}>
        {({open}) => (
          <>
            <Menu.Button
              ref={triggerRef}
              className={`rounded-full ${
                open ? 'text-primary-500 bg-slate-100' : 'text-primary-500'
              }`}
            >
              <span className="sr-only">Menu</span>
              <EllipsisHorizontalIcon className="h-4 w-4" />
            </Menu.Button>
            <Transition
              style={{
                height: listRef.current?.clientHeight,
                left: triggerRef?.current?.getBoundingClientRect()?.left,
                top: triggerRef?.current?.getBoundingClientRect()?.top + 20,
              }}
              className={cn(
                'absolute z-10 mt-1 min-w-[9rem] origin-top-right overflow-hidden rounded border border-slate-200 bg-white shadow-lg',
                {
                  // 'right-0': align === 'right',
                  // 'left-0': align === 'left',
                  // 'top-full': placement === 'bottom',
                  // 'bottom-full': placement === 'top',
                },
              )}
              enter="transition ease-out duration-200 transform"
              enterFrom={cn('opacity-0 -translate-y-2')}
              enterTo={cn('opacity-100 translate-y-0')}
              leave="transition ease-out duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Transition
                style={{height: listRef.current?.clientHeight}}
                className={cn(
                  'fixed z-10 min-w-[9rem] origin-top-right overflow-hidden rounded border border-slate-200 bg-white shadow-lg',
                  {
                    // 'right-0': align === 'right',
                    // 'left-0': align === 'left',
                    // 'top-full': placement === 'bottom',
                    // 'bottom-full': placement === 'top',
                  },
                )}
                enter="transition ease-out duration-200 transform"
                enterFrom={cn('opacity-0 -translate-y-2')}
                enterTo={cn('opacity-100 translate-y-0')}
                leave="transition ease-out duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Menu.Items ref={listRef} as="ul" className="focus:outline-none">
                  {options.map(({label, Icon, isLink, showDivider, href, onClick}) => (
                    <Menu.Item key={label} as="li">
                      {({active}) =>
                        isLink && href ? (
                          <Link
                            className={cn(
                              'flex items-center px-3 py-2 text-sm font-medium gap-2 text-primary-500',
                              {
                                'bg-primary-25': active,
                                'border-b border-border': showDivider,
                              },
                            )}
                            href={href}
                          >
                            <Icon className="w-4 h-4" />
                            {label}
                          </Link>
                        ) : (
                          <button
                            onClick={onClick}
                            className={cn(
                              'flex items-center px-3 py-2 text-sm font-medium gap-2 text-primary-500 w-full',
                              {
                                'bg-primary-25': active,
                                'border-b border-border': showDivider,
                              },
                            )}
                          >
                            <Icon className="w-4 h-4" />
                            {label}
                          </button>
                        )
                      }
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Transition>
          </>
        )}
      </Menu>
    </>
  )
}
