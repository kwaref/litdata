/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect} from 'react'
import {isDev, isFunction} from './utils'
import useLatest from './use-latest'

const useUnmount = (fn: any) => {
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(`useUnmount expected parameter is a function, got ${typeof fn}`)
    }
  }

  const fnRef = useLatest(fn)

  useEffect(
    () => () => {
      fnRef.current()
    },
    [],
  )
}

export default useUnmount
