import { AuthProvider } from './context/AuthContext'
import AppRouter from './router/index'
import './index.css'

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}
