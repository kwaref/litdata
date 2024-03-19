'use client'

import {cn} from '@/components/utils/tailwindMerge'
import {type InputHTMLAttributes, memo, useRef, useEffect} from 'react'

interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean
  label: string
  labelClass?: string
  onSelect?: (e: any) => void
  partialChecked?: (e: any) => void
  classNames?: {
    base?: string
  }
}

function CheckboxField({
  label,
  labelClass,
  onChange,
  onSelect,
  indeterminate,
  classNames,
  ...props
}: CheckboxFieldProps) {
  const checkboxRef = useRef<any>()

  const handleOnchange = (e: any) => {
    onChange?.(e)
    onSelect?.(e)
  }
  return (
    <div>
      <label className={cn('flex items-center', classNames?.base)}>
        <input
          {...props}
          // id="excel"
          // value="excel"
          onChange={handleOnchange}
          type="checkbox"
          // name="exportType"
          // style={{backgroundImage: 'none !important'}}
          className={cn(
            '!border-primary-200 checked:focus:bg-primary-500 checked:!border-secondary-600 checked:!bg-secondary-600 focus:ring-secondary-600 checked:focus:!border-secondary-600 form-checkbox border-[1.5px] bg-transparent hover:cursor-pointer disabled:cursor-default checked:[background-image:none]',
            {
              "checked:!bg-transparent !border-secondary-600 [background-image:url('/checkbox-indeterminate.png')]":
                indeterminate,
              '!border-none checked:!bg-transparent checked:![background-image:url(/svg/checkbox-checked.svg)]':
                props?.checked,
            },
          )}
          // checked={exportType === 'excel'}
          // onChange={onChange}
        />
        <span
          className={cn(
            'ml-2 text-sm text-primary-500',
            {'text-primary-200': props?.disabled},
            labelClass,
          )}
        >
          {label}
        </span>
      </label>
    </div>
  )
}

export default memo(CheckboxField)
