'use client'

import Flatpickr from 'react-flatpickr'
import {type Hook, type Options} from 'flatpickr/dist/types/options'
import {type Instance} from 'flatpickr/dist/types/instance'
import {CalendarIcon} from '@heroicons/react/24/outline'
import {inputVariants} from './InputField'
import {cn} from '@/components/utils/tailwindMerge'
import {format} from 'date-fns'
import {useMemo} from 'react'

interface DatePickerFieldProps extends Options {
  onChange?: (dates: Date[], currentDateString: string, self: Instance) => void
  onReady?: (dates: Date[], currentDateString: string, self: Instance) => void
  align?: 'left' | 'right'
  label?: string
  value?: string | Date | undefined
  required?: boolean
  error?: boolean
  helperText?: string
}

function DatePickerField({
  label,
  align,
  onChange,
  onReady,
  mode = 'single',
  value,
  defaultDate,
  error,
  helperText,
  ...props
}: DatePickerFieldProps) {
  const singleDate = value ?? defaultDate ?? undefined

  const handleOnReady: Hook = (selectedDates, dateStr, instance) => {
    ;(instance.element as HTMLInputElement).value =
      mode === 'single' ? dateStr : dateStr.replace('to', '-')
    const customClass = align ?? ''
    instance.calendarContainer.classList.add(`flatpickr-${customClass}`)
    onReady?.(selectedDates, dateStr, instance)
  }

  const handleOnChange: Hook = (selectedDates, dateStr, instance) => {
    ;(instance.element as HTMLInputElement).value =
      mode === 'single' ? dateStr : dateStr.replace('to', '-')
    onChange?.(selectedDates, dateStr, instance)
  }

  const options: Options = useMemo(
    () => ({
      mode,
      static: true,
      monthSelectorType: 'static',
      dateFormat: 'm/d/Y\\',
      defaultDate:
        mode === 'single' ? singleDate : [new Date().setDate(new Date().getDate() - 6), new Date()],
      prevArrow:
        '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      ...props,
      onReady: handleOnReady,
      onChange: handleOnChange,
      disableMobile: true,
    }),
    [singleDate, mode, props, defaultDate],
  )

  return (
    <label className="flex w-full flex-col gap-1 text-xs">
      {label && (
        <span className={cn('text-primary-500 text-xs', {'text-danger': error})}>
          {label} {props?.required && <span className="text-danger text-xs ">*</span>}
        </span>
      )}
      <div className="relative w-full">
        <Flatpickr
          className={cn(
            inputVariants({variant: 'outlined', error}),
            '[&.flatpickr-day]:!bg-secondary-600 pl-9',
          )}
          options={options}
        />

        <div className="pointer-events-none absolute inset-0 right-auto flex items-center">
          <CalendarIcon className="ml-3 h-4 w-4 " />
        </div>
      </div>
      {error && <div className="text-xs text-danger">{helperText}</div>}
    </label>
  )
}

DatePickerField.displayName = 'DatePickerField'

export default DatePickerField
