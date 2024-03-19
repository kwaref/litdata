import {type VariantProps, cva} from 'class-variance-authority'
import {type InputHTMLAttributes, memo, type ReactNode} from 'react'
import {cn} from '../../utils/tailwindMerge'

export const inputVariants = cva(
  'w-full form-input border text-primary-500 placeholder:text-primary-200 text-sm h-10',
  {
    variants: {
      disabled: {
        true: '!border-primary-50 !bg-primary-25',
        false: '',
      },
      error: {
        true: 'blur:!border-danger !border-danger hover:!border-danger focus:!border-danger focus:!ring-1 focus:!ring-danger',
        false: '',
      },
      variant: {
        contained: '',
        outlined: '',
      },
      color: {
        inherit:
          'blur:border-primary-100 focus:border-primary-500 focus:ring-primary-500 border-primary-100 bg-primary-50 hover:border-primary-100 focus:ring-1',
      },
    },
    compoundVariants: [
      {
        variant: 'contained',
        color: 'inherit',
        className: '',
      },
      {
        variant: 'outlined',
        color: 'inherit',
        className: 'bg-transparent',
      },
    ],
    defaultVariants: {
      variant: 'contained',
      color: 'inherit',
      disabled: false,
      error: false,
    },
  },
)

export type InputVariantsProps = VariantProps<typeof inputVariants>
export type InputFieldsProps = InputVariantsProps &
  InputHTMLAttributes<HTMLInputElement> & {
    error?: boolean
    helperText?: string
    label?: string
    endIcon?: ReactNode
    startIcon?: ReactNode
    classNames?: {
      label?: string
      input?: string
      endIcon?: string
      startIcon?: string
    }
    inputRef?: any
  }

function InputFields({
  error,
  helperText,
  className,
  color,
  variant,
  label,
  classNames,
  endIcon,
  startIcon,
  inputRef,
  ...props
}: InputFieldsProps) {
  return (
    <div className={className}>
      <div>
        <label
          className={cn(
            'mb-1 block text-xs text-primary-500',
            {'text-danger': error},
            classNames?.label,
          )}
          htmlFor={props.name}
        >
          {label} {props.required && <span className="text-xs text-danger">*</span>}
        </label>
        <div className="relative">
          <span className={cn('absolute left-2 top-2.5', classNames?.startIcon)}>{startIcon}</span>
          <input
            ref={inputRef}
            id={props.name}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className={cn(
              'w-full overflow-hidden text-ellipsis',
              {'pl-8': startIcon},
              {'pr-8': endIcon},
              inputVariants({
                color,
                variant,
                error,
                disabled: props.disabled,
              }),
              classNames?.input,
            )}
            {...props}
          />
          <span className={cn('absolute right-2 top-2.5', classNames?.endIcon)}>{endIcon}</span>
        </div>
      </div>
      {error && <div className="mt-1 text-xs text-danger">{helperText}</div>}
    </div>
  )
}

export default memo(InputFields)
