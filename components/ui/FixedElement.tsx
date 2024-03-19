'use client'

import {memo, useEffect, useState} from 'react'
import {create} from 'zustand'
import {cn} from '../utils/tailwindMerge'
import {useDialog} from '../utils/use-dialog'
import useDebounceFn from '../utils/use-debounceFn'

type FixedElementStore = {
  key: string | null
  setKey: (key: string) => void
}

export const fixedElementStore = create<FixedElementStore>()(set => ({
  key: null,
  setKey: (key: string) => set({key}),
}))

function FixedElement() {
  const key = fixedElementStore(state => state.key)
  const {isOpen, payload} = useDialog(key!)
  const [props, setProps] = useState<any>(null)
  const [canMount, setCanMount] = useState(false)
  const {run} = useDebounceFn(() => setCanMount(true), {wait: 100})

  useEffect(() => {
    isOpen && setProps(payload?.props)
  }, [payload?.props, isOpen])

  if (!key || !props || !isOpen) {
    return null
  }

  const Element = () => (
    <div {...props} className={cn('hidden', {'block ': props?.style}, props?.className)}>
      {payload?.children}
    </div>
  )
  run()

  return canMount && <Element />
}

FixedElement.displayName = 'FixedElement'

// @ts-ignore
export default memo(FixedElement)
