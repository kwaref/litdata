'use client'

import useToggle from '../utils/useToggle'
import {cn} from '../utils/tailwindMerge'
import {ChevronDownIcon} from '@heroicons/react/20/solid'

export default function Accordion({
  children,
  title,
  classNames,
  disabled = false,
}: {
  children: React.ReactNode
  title: string | React.ReactNode | React.ReactElement
  classNames?: {
    base?: string
    label?: string
  }
  disabled?: boolean
}) {
  const {isOpen, onToggle} = useToggle()
  return (
    <div
      className={cn(
        'rounded border border-border px-3 py-3.5',
        {'text-primary-200 cursor-not-allowed': disabled},
        classNames?.base,
      )}
    >
      <div
        className={cn(
          'flex w-full items-center gap-2 justify-between accordion',
          classNames?.label,
        )}
        aria-expanded={isOpen}
        onClick={e => {
          const isCheckboxClick =
            // @ts-ignore
            e.target.closest('input[type="checkbox"]') || e.target.closest('.checkbox-field')

          if (!isCheckboxClick && !disabled) {
            onToggle()
          }
        }}
      >
        {title}
        <ChevronDownIcon
          className={cn('h-5 w-5 ', {
            'rotate-180': isOpen,
          })}
        />
      </div>
      <div className={cn('mt-3 ', {hidden: !isOpen})}>{children}</div>
    </div>
  )
}
