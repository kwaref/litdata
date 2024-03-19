'use client'

import {type ReactNode, useState, MouseEventHandler} from 'react'
import {Menu, Transition} from '@headlessui/react'
import {cn} from '../utils/tailwindMerge'
import {type ButtonVariantsProps, buttonVariants} from './ButtonCVA'

export type MenuProps = {
  label: string
  // path?: '';
  onClick?: (e: any) => void
  className?: string
  Icon?: any
}

type DropdownProps = ButtonVariantsProps & {
  menu: MenuProps[]
  children: ReactNode | string
  classNames?: {
    trigger?: string
    panel?: string
  }
  disabled?: boolean | undefined
}

export default function Dropdown({
  menu,
  variant,
  color,
  children,
  classNames,
  disabled = false,
}: DropdownProps) {
  return (
    <Menu as="div" className="relative inline-flex w-auto bg-background">
      {({open}) => (
        <>
          <Menu.Button
            className={cn(
              buttonVariants({variant, color, disabled}),
              'group inline-flex items-center justify-center',
              classNames?.trigger,
            )}
            aria-label="Dropdown option"
            disabled={disabled}
          >
            {children}
          </Menu.Button>
          <Transition
            className={cn(
              'absolute left-0 top-full z-40 mt-1 w-auto overflow-hidden rounded border border-border bg-background shadow-sm md:w-full',
              classNames?.panel,
            )}
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-out duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Menu.Items className="text-primary-500 text-sm focus:outline-none">
              {menu?.map(({label, className, Icon, ...rest}, idx) => (
                <Menu.Item key={idx}>
                  {({active}) => (
                    <button
                      className={cn(
                        'flex w-full cursor-pointer items-center px-5 py-2 first:pt-3 last:pb-3 border-b border-primary-50',
                        {
                          'bg-primary-25': active,
                        },
                        className,
                      )}
                      {...rest}
                    >
                      {Icon && Icon}
                      <span className={cn({'ml-2': !!Icon})}>{label}</span>
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}
