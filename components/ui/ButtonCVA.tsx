'use client'

import React, {forwardRef, useRef, type ButtonHTMLAttributes} from 'react'
import {mergeRefs} from 'react-merge-refs'
import {cva, type VariantProps} from 'class-variance-authority'

import {cn} from '@/components/utils/tailwindMerge'

export const buttonVariants = cva('btn py-2 text-sm font-normal whitespace-nowrap', {
  variants: {
    disabled: {
      true: '!bg-primary-50 !text-primary-100',
      false: '',
    },
    variant: {
      contained: '',
      outlined: 'border',
      link: 'shadow-none',
    },
    color: {
      inherit: 'bg-primary-25 hover:bg-primary-25 text-primary-500 hover:text-primary-500',
      secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white hover:text-white',
      success: 'bg-success text-white hover:bg-success hover:text-white',
      danger: 'bg-danger text-white hover:bg-danger hover:text-white',
      info: 'bg-info text-white hover:bg-info hover:text-white',
    },
  },
  compoundVariants: [
    {
      variant: 'contained',
      color: 'inherit',
      className: 'hover:bg-primary-50 ',
    },
    {
      variant: 'contained',
      color: 'secondary',
      className: 'hover:bg-secondary-700',
    },
    {
      variant: 'contained',
      color: 'success',
      className: 'hover:bg-success/[.85]',
    },
    {
      variant: 'contained',
      color: 'danger',
      className: 'hover:bg-danger/[.85]',
    },
    {
      variant: 'contained',
      color: 'info',
      className: 'hover:bg-info/[.85]',
    },
    {
      variant: 'outlined',
      color: 'inherit',
      className: 'text-primary-500  border-primary-100 bg-transparent',
    },
    {
      variant: 'outlined',
      color: 'secondary',
      className: 'border-secondary-600  text-secondary-600 bg-transparent',
    },
    {
      variant: 'outlined',
      color: 'success',
      className: 'border-success  bg-transparent text-success',
    },
    {
      variant: 'outlined',
      color: 'danger',
      className: ' border-danger  bg-transparent text-danger',
    },
    {
      variant: 'outlined',
      color: 'info',
      className: 'border-info  bg-transparent text-info',
    },
    {
      variant: 'link',
      color: 'inherit',
      className: 'text-primary-500 hover:text-primary-500 bg-transparent hover:bg-transparent',
    },
    {
      variant: 'link',
      color: 'secondary',
      className: 'text-secondary-600 hover:text-secondary-600 bg-transparent hover:bg-transparent',
    },
    {
      variant: 'link',
      color: 'success',
      className: 'bg-transparent text-success hover:bg-transparent hover:text-success',
    },
    {
      variant: 'link',
      color: 'danger',
      className: 'bg-transparent text-danger hover:bg-transparent hover:text-danger',
    },
    {
      variant: 'link',
      color: 'info',
      className: 'bg-transparent text-info',
    },
  ],
  defaultVariants: {
    variant: 'contained',
    color: 'secondary',
    disabled: false,
  },
})

export type ButtonVariantsProps = VariantProps<typeof buttonVariants>
type Props = ButtonVariantsProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean
    width?: number
    loading?: boolean
    isIconOnly?: boolean
    Component?: React.ComponentType
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
  }

const ButtonCVA = forwardRef<HTMLButtonElement, Props>((props, buttonRef) => {
  const {
    className,
    variant,
    color,
    children,
    active,
    width,
    loading = false,
    disabled = false,
    isIconOnly = false,
    style = {},
    Component = 'button',
    startIcon,
    endIcon,
    ...rest
  } = props
  const ref = useRef(null)

  return (
    <button
      aria-pressed={active}
      data-variant={variant}
      ref={mergeRefs([ref, buttonRef])}
      className={cn(buttonVariants({variant, color, disabled: props?.disabled}), className)}
      disabled={loading || disabled}
      type="button"
      style={{
        width,
        ...style,
      }}
      {...rest}
    >
      {renderChildren({loading, isIconOnly, startIcon, endIcon, children})}
    </button>
  )
})

const renderChildren = ({loading, isIconOnly, startIcon, endIcon, children}: any) => {
  if (isIconOnly) {
    if (loading) {
      return <LoadingIcon />
    }
    if (startIcon) {
      return startIcon
    }
    if (endIcon) {
      return endIcon
    }
  }

  if (loading && startIcon) {
    return (
      <>
        <LoadingIcon />
        {children}
      </>
    )
  }

  if (loading && endIcon) {
    return (
      <>
        {children}
        <LoadingIcon />
      </>
    )
  }

  if (loading && !startIcon && !endIcon) {
    return (
      <>
        <LoadingIcon classNames={{base: 'pr-2'}} />
        {children}
      </>
    )
  }

  if (!loading) {
    return (
      <>
        {startIcon}
        {children}
        {endIcon}
      </>
    )
  }
  return children
}

export function LoadingIcon({classNames}: {classNames?: {base?: string; icon?: string}}) {
  return (
    <i className={cn('m-0 flex', classNames?.base)}>
      <svg
        aria-hidden="true"
        role="status"
        className={cn('inline h-4 w-4 animate-spin', classNames?.icon)}
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="#E5E7EB"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentColor"
        />
      </svg>
    </i>
  )
}

export default ButtonCVA
