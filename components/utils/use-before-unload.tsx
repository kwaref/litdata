import {useCallback, useEffect} from 'react'
import {off, on} from './utils'

export const useBeforeUnload = (
  enabled: boolean | (() => boolean) = true,
  message: string = 'Unsaved report!. Exit without saving will discard your report filters. Are you sure want to leave this page?',
) => {
  const handler = useCallback(
    (event: BeforeUnloadEvent) => {
      const finalEnabled = typeof enabled === 'function' ? enabled() : enabled

      if (!finalEnabled) {
        return
      }

      event.preventDefault()

      if (message) {
        event.returnValue = message
      }

      return message
    },
    [enabled, message],
  )

  useEffect(() => {
    if (!enabled) {
      return
    }

    on(window, 'beforeunload', handler)

    return () => off(window, 'beforeunload', handler)
  }, [enabled, handler])
}
