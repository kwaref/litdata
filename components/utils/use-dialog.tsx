import {create} from 'zustand'
import {useMemo} from 'react'

interface StoreProps {
  isOpen: boolean
  dialog: string | null
  payload: any
  openDialog: (payload?: any) => void
  closeDialog: () => void
}

const store = create<StoreProps>()(set => ({
  isOpen: false,
  dialog: null,
  payload: null,
  openDialog: (params?: any) => set({isOpen: true, ...params}),
  closeDialog: () => set({isOpen: false, dialog: null, payload: null}),
}))

export const useDialog = (dialog: string): StoreProps => {
  const _isOpen = store(state => state.isOpen)
  const _dialog = store(state => state.dialog)
  const _payload = store(state => state.payload)

  const _openDialog = store(state => state.openDialog)
  const _closeDialog = store(state => state.closeDialog)

  const actions = useMemo(() => {
    const openDialog = (payload: any) => _openDialog?.({dialog, payload})
    const closeDialog = () => _closeDialog?.()
    const setOpen = (value: boolean) => (value ? _openDialog({dialog}) : _openDialog())
    return {openDialog, closeDialog, setOpen}
  }, [_openDialog, dialog, _closeDialog])

  const isOpen = _isOpen && _dialog === dialog

  try {
    return {
      isOpen,
      dialog,
      payload: isOpen ? _payload : null,
      ...actions,
    }
  } catch (e) {
    return {
      isOpen: false,
      dialog: null,
      payload: null,
      openDialog: () => {},
      closeDialog: () => {},
    }
  }
}
