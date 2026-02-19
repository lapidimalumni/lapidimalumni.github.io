import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { User } from '../types/user'
import * as api from '../lib/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  sendMagicLink: (email: string) => Promise<{ error?: string }>
  verifyToken: (token: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const SESSION_KEY = 'session_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const validateSession = useCallback(async () => {
    const token = localStorage.getItem(SESSION_KEY)
    if (!token) {
      setIsLoading(false)
      return
    }

    const result = await api.getSession(token)
    if (result.data?.user) {
      setUser(result.data.user)
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    validateSession()
  }, [validateSession])

  const sendMagicLink = async (email: string): Promise<{ error?: string }> => {
    const result = await api.sendMagicLink(email)
    if (result.error) {
      return { error: result.error }
    }
    return {}
  }

  const verifyToken = async (token: string): Promise<{ error?: string }> => {
    const result = await api.verifyMagicLink(token)
    if (result.error) {
      return { error: result.error }
    }
    if (result.data) {
      localStorage.setItem(SESSION_KEY, result.data.session_token)
      setUser(result.data.user)
    }
    return {}
  }

  const logout = async () => {
    const token = localStorage.getItem(SESSION_KEY)
    if (token) {
      await api.logoutSession(token)
    }
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isLoading,
      sendMagicLink,
      verifyToken,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
