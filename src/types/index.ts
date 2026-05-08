// Domain models

export type Role = 'admin' | 'worker'

export interface User {
  id: number
  name: string
  email: string
  role: Role
}

export interface Product {
  id: string
  name: string
  category: string
  stock: number
  min_stock: number
  max_stock: number
  price: number
}

// Auth context contracts

export interface LoginResult {
  ok: boolean
  error?: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<LoginResult>
  logout: () => void
}
