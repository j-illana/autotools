// Modelos del dominio

export type Rol = 'admin' | 'trabajador'

export interface Usuario {
  id: string
  nombre: string
  correo: string
  rol: Rol
}

export interface Producto {
  id: string
  nombre: string
  categoria: string
  stock: number
  precio: number
}

// Contratos del AuthContext

export interface LoginResult {
  ok: boolean
  error?: string
}

export interface AuthContextType {
  user: Usuario | null
  login: (correo: string, contrasena: string) => LoginResult
  logout: () => void
}
