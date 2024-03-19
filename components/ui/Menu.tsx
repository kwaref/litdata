'use client'

import {useEffect, useState} from 'react'
import {Menu as MenuUI, Transition} from '@headlessui/react'
import {cn} from '@/components/utils/tailwindMerge'
import {CheckIcon} from '@heroicons/react/20/solid'

interface MenuProps {
  value?: any
  label?: string
  className?: string
  onSelect: (value: any) => void
  options: Array<{
    label: string
    value: any
  }>
}

export default function Menu({label, value, options, onSelect, className}: MenuProps) {
  const [selected, setSelected] = useState<any>(value)

  const handleSelect = (value: any) => {
    setSelected(value)
    onSelect(value)
  }

  return (
    <label className={cn('flex w-full flex-col gap-2 text-sm', className)}>
      {label && <span className="text-primary-500 text-xs">{label}</span>}
      <MenuUI as="div" className="relative inline-flex w-full">
        {({open}) => (
          <>
            <MenuUI.Button
              className="btn text-primary-500 w-full min-w-[11rem] justify-between border-border bg-background"
              aria-label="Select option"
            >
              <span className="flex items-center text-left">
                <span>{options?.find(opt => opt.value === selected)?.label}</span>
              </span>
              <svg
                className="ml-1 shrink-0 fill-current text-slate-400"
                width="11"
                height="7"
                viewBox="0 0 11 7"
              >
                <path d="M5.4 6.8L0 1.4 1.4 0l4 4 4-4 1.4 1.4z" />
              </svg>
            </MenuUI.Button>
            <Transition
              className="absolute left-0 top-full z-10 mt-1 w-full overflow-hidden rounded border border-border bg-background px-1.5 py-3 shadow-lg"
              enter="transition ease-out duration-100 transform"
              enterFrom="opacity-0 -translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-out duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <MenuUI.Items className="text-primary-500 text-sm font-medium focus:outline-none">
                {options.map((option, optionIndex) => (
                  <MenuUI.Item key={optionIndex}>
                    {({active}) => (
                      <button
                        className="hover:bg-primary-25 flex w-full cursor-pointer items-center justify-between px-2 py-1.5 text-left"
                        onClick={() => {
                          handleSelect(option?.value)
                        }}
                      >
                        <span>{option?.label}</span>
                        {option?.value === selected && (
                          <CheckIcon className="text-secondary-600 h-4 w-4 shrink-0" />
                        )}
                      </button>
                    )}
                  </MenuUI.Item>
                ))}
              </MenuUI.Items>
            </Transition>
          </>
        )}
      </MenuUI>
    </label>
  )
}
