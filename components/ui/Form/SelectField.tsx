'use client'

import {Fragment, type ReactNode, useState, useEffect} from 'react'
import {Listbox, Transition, type ListboxOptionProps} from '@headlessui/react'
import {cn} from '@/components/utils/tailwindMerge'
import {type InputVariantsProps, inputVariants} from './InputField'
import {ChevronDownIcon} from '@heroicons/react/20/solid'

type SelectFieldProps = InputVariantsProps & {
  label?: string
  value?: string | number
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
  startIcon?: ReactNode
  required?: boolean
  classNames?: {
    option?: string
    input?: string
  }
  placement?: string
}

export default function SelectField({
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
  startIcon,
  required,
  classNames,
  placement,
}: SelectFieldProps) {
  const [selected, setSelected] = useState<any>()

  const handleChange = (value: any) => {
    setSelected(value)
    onChange(value)
  }

  return (
    <div className={cn('w-full', className)}>
      <Listbox value={value} onChange={handleChange} {...listboxProps} disabled={disabled || false}>
        <Listbox.Label
          className={cn('text-primary-500 text-xs flex items-center gap-1', {'text-danger': error})}
        >
          {label}
          {required && <span className="text-danger">*</span>}
        </Listbox.Label>
        <div className="relative w-full mt-1">
          <Listbox.Button
            className={cn(inputVariants({variant, color, error, disabled}), classNames?.input)}
          >
            <span className="flex items-center text-left">
              {startIcon && startIcon}
              <span className={cn('block truncate', {'ml-2': !!startIcon})}>
                {items?.find(item => item?.value?.toString() === value?.toString())?.label ??
                  selected}
              </span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 transform"
            leaveTo="opacity-0"
            // className={cn(
            //   'absolute z-50 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm',
            //   placement === 'top' ? 'mb-1 bottom-full' : 'mt-1 top-full',
            // )}
          >
            <Listbox.Options
              className={cn(
                'absolute z-20 mt-1 max-h-48 w-full rounded-md bg-background py-1 text-sm shadow-lg ring-primary-500/5 focus:outline-none overflow-hidden overflow-y-auto border border-border',
                placement === 'top' ? 'mb-1 bottom-full' : 'mt-1 top-full',
              )}
            >
              {items?.map(({label, value}) => (
                <Listbox.Option key={value} value={value} as={Fragment} {...optionProps}>
                  {({active, selected}) => (
                    <li
                      className={cn(
                        'flex w-full cursor-pointer items-center justify-between px-2 py-1.5',
                        classNames?.option,
                        {'bg-primary-25': active},
                      )}
                    >
                      {' '}
                      {label}
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
