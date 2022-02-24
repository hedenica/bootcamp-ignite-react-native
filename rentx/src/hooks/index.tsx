import React from 'react'

import { AuthProvider } from './auth'

interface AppProviderProps {
  children: React.ReactNode
}

const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

export { AppProvider }