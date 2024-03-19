import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfigFile from '@/tailwind.config.js'

export const tailwindConfig = resolveConfig(tailwindConfigFile) as any

export const getBreakpointValue = (value: string): number => {
  const screenValue = tailwindConfig.theme.screens[value]
  return +screenValue.slice(0, screenValue.indexOf('px'))
}

export const getBreakpoint = () => {
  let currentBreakpoint
  let biggestBreakpointValue = 0
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0
  for (const breakpoint of Object.keys(tailwindConfig.theme.screens)) {
    const breakpointValue = getBreakpointValue(breakpoint)
    if (breakpointValue > biggestBreakpointValue && windowWidth >= breakpointValue) {
      biggestBreakpointValue = breakpointValue
      currentBreakpoint = breakpoint
    }
  }
  return currentBreakpoint
}

export const hexToRGB = (h: string): string => {
  let r = 0
  let g = 0
  let b = 0
  if (h.length === 4) {
    r = parseInt(`0x${h[1]}${h[1]}`)
    g = parseInt(`0x${h[2]}${h[2]}`)
    b = parseInt(`0x${h[3]}${h[3]}`)
  } else if (h.length === 7) {
    r = parseInt(`0x${h[1]}${h[2]}`)
    g = parseInt(`0x${h[3]}${h[4]}`)
    b = parseInt(`0x${h[5]}${h[6]}`)
  }
  return `${+r},${+g},${+b}`
}

export const formatValue = (value: number): string =>
  Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumSignificantDigits: 3,
    notation: 'compact',
  }).format(value)

export const formatThousands = (value: number): string =>
  Intl.NumberFormat('en-US', {
    maximumSignificantDigits: 3,
    notation: 'compact',
  }).format(value)

export const noop = () => {}
export const isBrowser = typeof window !== 'undefined'
export const isObject = (value: any) => value !== null && typeof value === 'object'
export const isFunction = (value: any) => typeof value === 'function'

export const isString = (value: any) => typeof value === 'string'
export const isBoolean = (value: any) => typeof value === 'boolean'
export const isNumber = (value: any) => typeof value === 'number'
export const isUndef = (value: any) => typeof value === 'undefined'

export const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'

export const isScrollable = function (ele: any) {
  const hasScrollableContent = ele.scrollHeight > ele.clientHeight

  const overflowYStyle = window.getComputedStyle(ele).overflowY
  const isOverflowHidden = overflowYStyle.includes('hidden')

  return hasScrollableContent && !isOverflowHidden
}

export const getScrollableParent = function (ele: any): any {
  return !ele || ele === document.body
    ? document.body
    : isScrollable(ele)
    ? ele
    : getScrollableParent(ele.parentNode)
}

export function on<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  // eslint-disable-next-line @typescript-eslint/ban-types
  ...args: Parameters<T['addEventListener']> | [string, Function | null, ...any]
): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(...(args as Parameters<HTMLElement['addEventListener']>))
  }
}

export function off<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  // eslint-disable-next-line @typescript-eslint/ban-types
  ...args: Parameters<T['removeEventListener']> | [string, Function | null, ...any]
): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(...(args as Parameters<HTMLElement['removeEventListener']>))
  }
}
