import {create} from 'zustand'
import {useMemo} from 'react'

interface StoreProps {
  isOpen: boolean
  drawer: string | null
  payload: any
  openDrawer: (payload?: any) => void
  closeDrawer: () => void
}

const store = create<StoreProps>()(set => ({
  isOpen: false,
  drawer: null,
  payload: null,
  openDrawer: (params?: any) => set({isOpen: true, ...params}),
  closeDrawer: () => set({isOpen: false, drawer: null, payload: null}),
}))

export const useDrawer = (drawer: string): StoreProps => {
  const _isOpen = store(state => state.isOpen)
  const _drawer = store(state => state.drawer)
  const _payload = store(state => state.payload)

  const _openDrawer = store(state => state.openDrawer)
  const _closeDrawer = store(state => state.closeDrawer)

  const actions = useMemo(() => {
    const openDrawer = (payload: any) => _openDrawer?.({drawer, payload})
    const closeDrawer = () => _closeDrawer?.()
    const setOpen = (value: boolean) => (value ? _openDrawer({drawer}) : _openDrawer())
    return {openDrawer, closeDrawer, setOpen}
  }, [_openDrawer, drawer, _closeDrawer])

  const isOpen = _isOpen && _drawer === drawer

  try {
    return {
      isOpen,
      drawer,
      payload: isOpen ? _payload : null,
      ...actions,
    }
  } catch (e) {
    return {
      isOpen: false,
      drawer: null,
      payload: null,
      openDrawer: () => {},
      closeDrawer: () => {},
    }
  }
}
