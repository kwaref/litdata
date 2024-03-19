import {memo, type ReactNode, type TextareaHTMLAttributes} from 'react'
import {cn} from '../../utils/tailwindMerge'
import {inputVariants, type InputVariantsProps} from './InputField'

export type TextAreaFieldProps = InputVariantsProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    error?: boolean
    helperText?: string
    label?: string
    endIcon?: ReactNode
    classNames?: {
      label?: string
      input?: string
      endIcon?: string
    }
    inputRef?: any
  }

function TextAreaField({
  error,
  helperText,
  className,
  color,
  variant,
  label,
  classNames,
  endIcon,
  inputRef,
  ...props
}: TextAreaFieldProps) {
  return (
    <div className={className}>
      <div>
        <label
          className={cn(
            'mb-1 block text-sm font-medium',
            {'text-danger': error},
            classNames?.label,
          )}
          htmlFor={props.name}
        >
          {label} {props.required && <span className="text-sm text-danger">*</span>}
        </label>
        <div className="relative">
          <textarea
            ref={inputRef}
            id={props.name}
            rows={4}
            maxLength={160}
            className={cn(
              'w-full',
              {'pr-8': endIcon},
              // @ts-ignore
              inputVariants({color: error ? 'danger' : color, variant}),
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

export default memo(TextAreaField)
