'use client'

import {type PropsWithChildren, useEffect, useRef, useState} from 'react'
import useDebounceFn from '@/components/utils/use-debounceFn'
import {cn} from '@/components/utils/tailwindMerge'
import InputField, {type InputFieldsProps} from './InputField'
import Button from '../ButtonCVA'
import {getScrollableParent} from '@/components/utils/utils'
import useToggle from '@/components/utils/useToggle'
import {CheckIcon, ChevronDownIcon, PlusIcon} from '@heroicons/react/20/solid'
import {TrashIcon} from '@heroicons/react/24/outline'

interface AutocompleteInputFieldProps extends InputFieldsProps {
  value?: string
  items: any[]
  onRemove?: (e: any) => void
  createOnInput?: (e: string) => void
  createOnList?: () => void
  name: string
  className?: string
  placement?: string
  wrapperProps?: Record<string, any>
  fixed: boolean
}

function AutocompleteInputField({
  value,
  onChange,
  items,
  onRemove,
  createOnInput,
  createOnList,
  className,
  wrapperProps,
  fixed,
  placement,
  ...props
}: AutocompleteInputFieldProps) {
  const {isOpen, onToggle, onClose} = useToggle()
  const [filteredItems, setFilteredItems] = useState<any>(null)
  const [text, setText] = useState<string>()
  const [maxWidth, setMaxWidth] = useState<number>(300)
  const [isBottom, setIsBottom] = useState(false)

  const wrapperRef = useRef<any>(null)
  const inputRef = useRef<any>(null)
  const listRef = useRef<any>(null)

  useEffect(() => {
    value && setText(items?.find(item => item.value === value)?.label)
    !filteredItems && setFilteredItems(items ?? [])
  }, [value, items])

  useEffect(() => {
    setFilteredItems(items)
  }, [items.length])

  useEffect(() => {
    if (value && !text) {
      const textValue = items?.find(
        item => item.value.toString()?.toLowerCase() === value?.toString()?.toLowerCase(),
      )?.label
      setText(textValue)
      onChange?.(value as any)
    }
    if (!value && text) {
      setText('')
    }
  }, [value, items])

  useEffect(() => {
    if (wrapperRef.current) {
      setMaxWidth(wrapperRef.current.offsetWidth)
    }

    function handleClickOutside(event: any) {
      if (
        !wrapperRef?.current?.contains(event.target) &&
        !listRef?.current?.contains(event.target)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      onClose()
      document.removeEventListener('', handleClickOutside)
    }
  }, [wrapperRef, listRef])

  // This function calculate X and Y
  const getPositionOnResize = () => {
    const wrapperEl = wrapperRef.current
    if (wrapperEl) {
      if (
        window.innerHeight <
        wrapperEl?.getBoundingClientRect().top +
          listRef.current?.clientHeight +
          wrapperEl?.clientHeight
      ) {
        setIsBottom(true)
        return
      }
      setIsBottom(false)
    }
  }

  useEffect(() => {
    getPositionOnResize()
  }, [filteredItems?.length])

  // Re-calculate X and Y of the red box when the window gets resized by the user
  useEffect(() => {
    const wrapperEl = wrapperRef.current

    window.addEventListener('resize', getPositionOnResize)
    getScrollableParent(wrapperEl).addEventListener('scroll', getPositionOnResize)

    return () => {
      window.removeEventListener('resize', getPositionOnResize)
      getScrollableParent(wrapperEl).removeEventListener('scroll', getPositionOnResize)
    }
  }, [])

  const newItems = (newValue: string) =>
    items?.filter(
      item =>
        item.value.toString().toLowerCase().includes(newValue.toString().toLowerCase()) ||
        item.label.toString().toLowerCase().includes(newValue.toString().toLowerCase()),
    )

  const {run} = useDebounceFn(
    (target: any) => {
      onChange?.(target.value)
    },
    {
      wait: 500,
    },
  )

  const onChangeText = ({target}: any) => {
    run(target)
    setText(target.value)
    setFilteredItems(newItems(target.value))
  }

  const onSelectionChange = (value: any) => {
    if (value === 'add new') {
      createOnList?.()
      onClose()
      return
    }

    setText(items.find(item => item.value === value)?.label)
    onChange?.(value)
    onClose()
  }

  const handleRemove = (value: string) => {
    onRemove?.(value)
    onClose()
  }

  const onOpen = () => {
    !isOpen && inputRef.current?.focus()
    onToggle()
  }

  const ListContainer = ({children}: PropsWithChildren) => {
    const styles = {maxHeight: isOpen ? 245 : 0, maxWidth, minWidth: maxWidth, zIndex: 999}
    const classes =
      'z-40 overflow-hidden overflow-y-auto rounded-md border border-border bg-background  shadow-sm transition-all duration-100'
    return (
      <div
        ref={listRef}
        style={{
          ...styles,
          top:
            placement === 'top'
              ? 0
              : isBottom
              ? `-${listRef.current?.clientHeight + +8}px`
              : `${wrapperRef?.current?.clientHeight + 10}px`,
        }}
        className={cn('absolute left-0', classes, {'!border-none': filteredItems === 0 || !isOpen})}
      >
        {fixed ? (
          <div
            ref={listRef}
            style={{
              ...styles,
              top: `${
                wrapperRef?.current?.getBoundingClientRect()?.top + (placement === 'top' ? 0 : 40)
              }px`,
              // }),
            }}
            className={cn('fixed', classes, {'!border-none': filteredItems === 0 || !isOpen})}
          >
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      <div {...wrapperProps} ref={wrapperRef} onClick={onOpen}>
        <InputField
          variant="outlined"
          {...props}
          inputRef={inputRef}
          value={text}
          onChange={onChangeText}
          autoComplete="off"
          endIcon={
            !props?.disabled && (
              <div className="flex items-center gap-1">
                <ChevronDownIcon
                  className={cn(
                    'ease h-5 w-5 transition-transform duration-150 motion-reduce:transition-none',
                    {'rotate-180': isOpen},
                  )}
                />
              </div>
            )
          }
        />
      </div>
      <ListContainer>
        <ul ref={listRef} className="">
          {createOnList && (
            <li>
              <PlusIcon className="h-4 w-4" /> Add new
            </li>
          )}
          {filteredItems?.map(({label, value}: any, index: number) => (
            <li
              key={value}
              className={cn(
                'hover:bg-primary-25 group flex cursor-pointer items-center justify-between gap-3 px-3 py-1.5',
                {
                  'border-b border-border': index < filteredItems.length - 1,
                  'bg-primary-25': text === label,
                },
              )}
              onClick={() => onSelectionChange(value)}
            >
              <div
              // className="line-clamp-1"
              >
                <span
                  className="text-xs leading-[0rem]"
                  dangerouslySetInnerHTML={{__html: label}}
                />
              </div>
              {/* <div className="flex gap-2"> */}
              {onRemove && (
                <Button
                  className="hidden min-w-[26px]  group-hover:flex"
                  color="danger"
                  variant="link"
                  isIconOnly
                  onClick={() => handleRemove(value)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              )}
              {/* {text === label && <CheckIcon className="text-secondary-600 h-4 w-4" />} */}
              {/* </div> */}
            </li>
          ))}
        </ul>
      </ListContainer>
    </div>
  )
}

AutocompleteInputField.displayName = 'AutocompleteInputField'

export default AutocompleteInputField
