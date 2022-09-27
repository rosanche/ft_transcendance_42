import React, { createContext, useContext } from 'react'

const HideModalContext = createContext<() => void>(undefined)

interface Props {
  children: React.ReactNode
  hideModal: () => void
}
const HideModalContextProvider = ({ children, hideModal }: Props) => {
  return (
    <HideModalContext.Provider value={hideModal}>
      {children}
    </HideModalContext.Provider>
  )
}

function useHideModalContext() {
  const context = useContext(HideModalContext)
  if (context === undefined) {
    throw new Error(
      'useHideModalContext must be used within a HideModalContextProvider'
    )
  }
  return context
}
export { HideModalContextProvider, useHideModalContext }
