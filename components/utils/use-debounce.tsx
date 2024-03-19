/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react'
import useDebounceFn from './use-debounceFn'

export interface DebounceOptions {
  wait?: number
  leading?: boolean
  trailing?: boolean
  maxWait?: number
}

function useDebounce(value: any, options?: DebounceOptions) {
  const [debounced, setDebounced] = useState(value)

  const {run} = useDebounceFn(() => {
    setDebounced(value)
  }, options)

  useEffect(() => {
    run()
  }, [value])

  return debounced
}

export default useDebounce
