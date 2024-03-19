import {useCallback, useEffect, useState} from 'react'

const useToggle = (init?: boolean) => {
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    init && setOpen(init)
  }, [init])

  const onToggle = useCallback(() => {
    setOpen(prevState => !prevState)
  }, [])

  const onClose = useCallback(() => {
    setOpen(false)
  }, [])

  const onOpen = useCallback(() => {
    setOpen(true)
  }, [])

  return {
    isOpen,
    setOpen,
    onToggle,
    onOpen,
    onClose,
  }
}

export default useToggle
