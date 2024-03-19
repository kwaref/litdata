import {useCallback, useEffect} from 'react'
import Router from 'next/router'
import {off, on} from './utils'

export const useLeavePageConfirm = (
  isConfirm = true,
  message = 'Are you sure want to leave this page?',
) => {
  // const {hasChanges} = useUrlChangeListener()
  // useBeforeUnload(isConfirm, message)
  // useEffect(() => {
  //   const handler = () => {
  //     if (isConfirm && !window.confirm(message)) {
  //       throw 'Route Canceled'
  //     }
  //   }
  //   if (hasChanges) {
  //     handler()
  //   }
  // }, [isConfirm, message, hasChanges])
}
