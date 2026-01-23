import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { mockUsers, MockUser } from '../data/mockUsers'

interface AuthContextType {
  user: MockUser | null
  isAuthenticated: boolean
  login: (email: string) => boolean
  loginWithToken: (token: string) => boolean
  logout: () => void
  checkEmail: (email: string) => MockUser | undefined
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('authUser')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('authUser')
      }
    }
  }, [])

  const checkEmail = (email: string): MockUser | undefined => {
    return mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
  }

  const login = (email: string): boolean => {
    const foundUser = checkEmail(email)
    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem('authUser', JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const loginWithToken = (token: string): boolean => {
    try {
      const email = atob(token)
      return login(email)
    } catch {
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('authUser')
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      loginWithToken,
      logout,
      checkEmail,
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
