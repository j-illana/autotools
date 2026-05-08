import { createContext, useContext, useState, ReactNode } from 'react'
import { api } from '../api/client'
import type { User, AuthContextType, LoginResult } from '../types'

const AuthContext = createContext<AuthContextType | null>(null)
const SESSION_KEY = 'autotools_user'
const TOKEN_KEY = 'autotools_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      return saved ? (JSON.parse(saved) as User) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY)
  })

  async function login(email: string, password: string): Promise<LoginResult> {
    try {
      const res = await api.post<{ token: string; user: User }>('/auth/login', { email, password })
      setUser(res.user)
      setToken(res.token)
      localStorage.setItem(SESSION_KEY, JSON.stringify(res.user))
      localStorage.setItem(TOKEN_KEY, res.token)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: (error as Error).message }
    }
  }

  function logout(): void {
    setUser(null)
    setToken(null)
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
