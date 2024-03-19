/* eslint-disable react-hooks/exhaustive-deps */
import {useMemo} from 'react'
import useLatest from './use-latest'
import useUnmount from './use-unmount'
import {isDev, isFunction} from './utils'
import {debounce} from './lodash-polyfill'
import {type DebounceOptions} from './use-debounce'

function useDebounceFn(fn: any, options?: DebounceOptions) {
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(`useDebounceFn expected parameter is a function, got ${typeof fn}`)
    }
  }

  const fnRef = useLatest(fn)

  const wait = options?.wait ?? 1000

  const debounced: any = useMemo(
    () =>
      debounce(
        (...args: any): any => {
          return fnRef.current(...args)
        },
        wait,
        options,
      ),
    [],
  )

  useUnmount(() => {
    debounced.cancel()
  })

  return {
    run: debounced,
    cancel: debounced.cancel,
    flush: debounced.flush,
  }
}

export default useDebounceFn
