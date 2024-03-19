'use client'

import {useState} from 'react'
import {Menu, Transition} from '@headlessui/react'
import {cn} from '../utils/tailwindMerge'
import {type ButtonVariantsProps, buttonVariants} from './ButtonCVA'

type MenuProps = {
  label: string
  // path?: '';
  onClick?: (() => void) | null
}

type SelectProps = ButtonVariantsProps & {
  menu: MenuProps[]
}

export default function Select({menu, variant, color}: SelectProps) {
  const [selected, setSelected] = useState<number>(0)

  return (
    <Menu as="div" className="relative inline-flex w-full">
      {({open}) => (
        <>
          <Menu.Button className={buttonVariants({variant, color})} aria-label="Select option">
            <span className="flex items-center">
              <span>{menu[selected].label}</span>
            </span>
            <svg
              className="ml-1 shrink-0 fill-current text-slate-400"
              width="11"
              height="7"
              viewBox="0 0 11 7"
            >
              <path d="M5.4 6.8L0 1.4 1.4 0l4 4 4-4 1.4 1.4z" />
            </svg>
          </Menu.Button>
          <Transition
            className="absolute left-0 top-full z-10 mt-1 w-full overflow-hidden rounded border border-slate-200 bg-white py-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800"
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-out duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Menu.Items className="divide-y divide-slate-200 text-sm font-medium text-slate-600 focus:outline-none dark:divide-slate-700 dark:text-slate-300">
              {menu?.map(({label, onClick, ...rest}, idx) => (
                <Menu.Item key={idx}>
                  {({active}) => (
                    <button
                      className={cn(
                        'flex w-full cursor-pointer items-center justify-between px-3 py-2',
                        {
                          'bg-slate-50 dark:bg-slate-700/20': active,
                          'text-indigo-500': idx === selected,
                        },
                      )}
                      onClick={() => {
                        setSelected(idx)
                        onClick?.()
                      }}
                      {...rest}
                    >
                      <span>{label}</span>
                      <svg
                        className={cn('mr-2 shrink-0 fill-current text-indigo-500', {
                          invisible: idx !== selected,
                        })}
                        width="12"
                        height="9"
                        viewBox="0 0 12 9"
                      >
                        <path d="M10.28.28L3.989 6.575 1.695 4.28A1 1 0 00.28 5.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28.28z" />
                      </svg>
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
