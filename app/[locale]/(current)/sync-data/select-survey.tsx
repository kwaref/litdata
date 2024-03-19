'use client'

import {Fragment, type ReactNode, useState} from 'react'
import {Listbox, Transition, type ListboxOptionProps} from '@headlessui/react'
import {cn} from '@/components/utils/tailwindMerge'
import {ChevronDownIcon} from '@heroicons/react/20/solid'
import {type InputVariantsProps, inputVariants} from '@/components/ui/Form/InputField'
import {SignalIcon} from '@heroicons/react/24/outline'

type SelectSurveyProps = InputVariantsProps & {
  label?: string
  value?: string
  className?: string
  onSelect?: (value: any) => void
  items: Array<{
    label: string
    value: any
  }>
  optionProps?: Record<string, any>
  error?: boolean
  helperText?: string
  ref?: any
  onBlur?: () => void
  onChange: (value: any) => void
  listboxProps?: Record<string, any>
  required?: boolean
}

export default function SelectSurvey({
  label,
  value,
  className,
  items = [],
  optionProps,
  error,
  helperText,
  disabled,
  onChange,
  variant,
  color,
  listboxProps,
  required,
}: SelectSurveyProps) {
  const [selected, setSelected] = useState()

  const handleChange = (value: any) => {
    setSelected(value)
    onChange(value)
  }

  return (
    <div className="w-60">
      <Listbox value={value} onChange={handleChange} {...listboxProps} disabled={disabled || false}>
        <Listbox.Label
          className={cn('text-primary-500 text-xs flex items-center gap-1', {'text-danger': error})}
        >
          {label}
          {required && <span className="text-danger">*</span>}
        </Listbox.Label>
        <div className="relative w-full mt-1">
          <Listbox.Button
            className={cn(inputVariants({variant, color, error, disabled}), '!bg-white')}
          >
            <span className="flex items-center text-left">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3.75736 3.06881C3.95262 3.26407 3.95262 3.58065 3.75736 3.77591C1.41421 6.11906 1.41421 9.91805 3.75736 12.2612C3.95262 12.4565 3.95262 12.773 3.75736 12.9683C3.5621 13.1636 3.24551 13.1636 3.05025 12.9683C0.316583 10.2346 0.316582 5.80248 3.05025 3.06881C3.24551 2.87354 3.5621 2.87354 3.75736 3.06881ZM12.2426 3.06881C12.4379 2.87354 12.7545 2.87354 12.9497 3.06881C15.6834 5.80248 15.6834 10.2346 12.9497 12.9683C12.7545 13.1636 12.4379 13.1636 12.2426 12.9683C12.0474 12.773 12.0474 12.4565 12.2426 12.2612C14.5858 9.91805 14.5858 6.11906 12.2426 3.77591C12.0474 3.58065 12.0474 3.26407 12.2426 3.06881ZM5.17157 4.48302C5.36683 4.67828 5.36683 4.99486 5.17157 5.19013C3.60948 6.75222 3.60948 9.28488 5.17157 10.847C5.36683 11.0422 5.36683 11.3588 5.17157 11.5541C4.97631 11.7493 4.65973 11.7493 4.46447 11.5541C2.51184 9.60147 2.51184 6.43564 4.46447 4.48302C4.65973 4.28776 4.97631 4.28776 5.17157 4.48302ZM10.8284 4.48302C11.0237 4.28776 11.3403 4.28776 11.5355 4.48302C13.4882 6.43564 13.4882 9.60147 11.5355 11.5541C11.3403 11.7493 11.0237 11.7493 10.8284 11.5541C10.6332 11.3588 10.6332 11.0422 10.8284 10.847C12.3905 9.28488 12.3905 6.75222 10.8284 5.19013C10.6332 4.99486 10.6332 4.67828 10.8284 4.48302ZM6.58579 5.89723C6.78105 6.0925 6.78105 6.40908 6.58579 6.60434C5.80474 7.38539 5.80474 8.65172 6.58579 9.43277C6.78105 9.62803 6.78105 9.94461 6.58579 10.1399C6.39052 10.3351 6.07394 10.3351 5.87868 10.1399C4.70711 8.9683 4.70711 7.06881 5.87868 5.89723C6.07394 5.70197 6.39052 5.70197 6.58579 5.89723ZM9.41421 5.89723C9.60948 5.70197 9.92606 5.70197 10.1213 5.89723C11.2929 7.06881 11.2929 8.9683 10.1213 10.1399C9.92606 10.3351 9.60948 10.3351 9.41421 10.1399C9.21895 9.94461 9.21895 9.62803 9.41421 9.43277C10.1953 8.65172 10.1953 7.38539 9.41421 6.60434C9.21895 6.40908 9.21895 6.0925 9.41421 5.89723ZM7.25 8.01855C7.25 7.60434 7.58579 7.26855 8 7.26855C8.41421 7.26855 8.75 7.60434 8.75 8.01855C8.75 8.43277 8.41421 8.76855 8 8.76855C7.58579 8.76855 7.25 8.43277 7.25 8.01855Z"
                    fill="#10B981"
                  />
                </svg>
              </span>
              <span className="block truncate ml-2">
                {items?.find(item => item.value === value)?.label ?? selected}
              </span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-20 mt-1 max-h-48 w-full rounded-md bg-background py-1 text-sm shadow-lg ring-1 ring-primary-500/5 focus:outline-none overflow-hidden overflow-y-auto">
              {items?.map(({label, value}) => (
                <Listbox.Option key={value} value={value} as={Fragment} {...optionProps}>
                  {({active, selected}) => (
                    <li
                      className={cn(
                        'flex w-full cursor-pointer items-center gap-2 px-4 py-1.5 border-b border-border last:border-none',
                        {'bg-primary-25': active},
                      )}
                    >
                      <SignalIcon className="w-4 h-4" /> {label}
                    </li>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error && <div className="mt-1 text-xs text-danger">{helperText}</div>}
    </div>
  )
}
