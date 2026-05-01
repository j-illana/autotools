import { createContext, useContext, useState, ReactNode } from 'react'
import usuariosData from '../data/usuarios.json'
import type { Usuario, AuthContextType, LoginResult } from '../types'

const AuthContext = createContext<AuthContextType | null>(null)
const SESSION_KEY = 'autotools_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      return saved ? (JSON.parse(saved) as Usuario) : null
    } catch {
      return null
    }
  })

  function login(correo: string, contrasena: string): LoginResult {
    const found = (usuariosData as Usuario[]).find(u => u.correo === correo)
    if (found && contrasena === '1234') {
      const usuario = found as Usuario
      setUser(usuario)
      localStorage.setItem(SESSION_KEY, JSON.stringify(usuario))
      return { ok: true }
    }
    return { ok: false, error: 'Credenciales incorrectas' }
  }

  function logout(): void {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
