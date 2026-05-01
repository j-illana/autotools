import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Login.module.css'

export default function Login() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const { login, user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    navigate('/dashboard/inventario', { replace: true })
    return null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const result = login(correo, contrasena)
    if (result.ok) {
      navigate('/dashboard/inventario')
    } else {
      setError(result.error ?? 'Error desconocido')
    }
  }

  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        <h1 className={styles.logo}>autoTools</h1>
        <p className={styles.subtitle}>Acceso al sistema de gestión</p>

        <form className={styles.card} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="correo">Correo electrónico</label>
            <div className={styles.inputBox}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                id="correo"
                type="email"
                className={styles.input}
                placeholder="usuario@autotools.com"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="contrasena">Contraseña</label>
            <div className={styles.inputBox}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="contrasena"
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={contrasena}
                onChange={e => setContrasena(e.target.value)}
                required
              />
            </div>
            <button type="button" className={styles.forgotLink}>¿Olvidaste tu contraseña?</button>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn}>Entrar</button>
        </form>

        <Link to="/" className={styles.backLink}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
          </svg>
          Volver al inicio
        </Link>
      </main>
    </div>
  )
}
