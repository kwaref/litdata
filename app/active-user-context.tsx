'use client'

import {createContext, useContext, useState} from 'react'

interface ActiveUserContextProps {
  activeUser: any
  setActiveUser: (activeUser: any) => void
}

const ActiveUserContext = createContext<ActiveUserContextProps | undefined>(undefined)

export const ActiveUserProvider = ({
  children,
  initialState = null,
}: {
  children: React.ReactNode
  initialState?: any
}) => {
  const [activeUser, setActiveUser] = useState<any>(initialState)
  return (
    <ActiveUserContext.Provider value={{activeUser, setActiveUser}}>
      {children}
    </ActiveUserContext.Provider>
  )
}

export const useActiveUserContext = () => {
  const context = useContext(ActiveUserContext)
  if (!context) {
    throw new Error('useActiveUser must be used within a ActiveUserProvider')
  }
  return context
}
