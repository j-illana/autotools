import { createContext, useContext, useState } from 'react'
import usuarios from '../data/usuarios.json'

const AuthContext = createContext(null)
const SESSION_KEY = 'autotools_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  function login(correo, contrasena) {
    const found = usuarios.find(u => u.correo === correo)
    if (found && contrasena === '1234') {
      setUser(found)
      localStorage.setItem(SESSION_KEY, JSON.stringify(found))
      return { ok: true }
    }
    return { ok: false, error: 'Credenciales incorrectas' }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
