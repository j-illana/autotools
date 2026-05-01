import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

import Home from '../pages/Home'
import Login from '../pages/Login'
import Search from '../pages/Search'
import Inventory from '../pages/dashboard/Inventory'
import Reports from '../pages/dashboard/Reports'
import Users from '../pages/dashboard/Users'

interface PrivateRouteProps {
  children: ReactNode
  adminOnly?: boolean
}

function PrivateRoute({ children, adminOnly = false }: PrivateRouteProps) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.rol !== 'admin') return <Navigate to="/dashboard/inventario" replace />
  return <>{children}</>
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/busqueda" element={<Search />} />
        <Route
          path="/dashboard/inventario"
          element={<PrivateRoute><Inventory /></PrivateRoute>}
        />
        <Route
          path="/dashboard/reportes"
          element={<PrivateRoute><Reports /></PrivateRoute>}
        />
        <Route
          path="/dashboard/usuarios"
          element={<PrivateRoute adminOnly><Users /></PrivateRoute>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
