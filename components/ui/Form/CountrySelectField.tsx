import {countries} from 'countries-list'
import React, {type SelectHTMLAttributes} from 'react'
import {inputVariants, type InputVariantsProps} from './InputField'
import {cn} from '@/components/utils/tailwindMerge'
import {FlagIcon} from '@heroicons/react/24/outline'

type CountrySelectProps = InputVariantsProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    label: string
    classNames?: {
      select: string
      list: string
    }
  }

const CountrySelect = ({
  label,
  variant,
  color,
  className,
  classNames,
  ...props
}: CountrySelectProps) => {
  return (
    <div className={cn('flex flex-col', className)}>
      <label className="mb-1 block text-xs text-primary-500" htmlFor="country">
        {label}
      </label>
      <div className="relative">
        <FlagIcon className="w-4 h-4 absolute left-3 top-3" />
        <select
          {...props}
          id="country"
          className={cn(
            inputVariants({variant, color}),
            'form-select w-full pl-9',
            classNames?.select,
          )}
        >
          <option value="" className={classNames?.list}>
            Selecciona un país
          </option>
          {Object.keys(countries).map(countryCode => (
            <option key={countryCode} value={countryCode}>
              {/* @ts-ignore */}
              {countries[countryCode].name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default CountrySelect
