import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styles from './Home.module.css'

export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    navigate(`/busqueda?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Link to="/login" className={styles.loginBtn}>INICIAR SESIÓN</Link>
      </header>

      <main className={styles.main}>
        <div className={styles.logoWrapper}>
          <svg className={styles.logoIcon} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
          </svg>
          <h1 className={styles.logo}>autoTools</h1>
        </div>
        <p className={styles.subtitle}>Consulta el inventario de autopartes</p>

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Busca una autoparte, código o referencia..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchBtn}>BUSCAR</button>
          </div>
        </form>
      </main>

      <footer className={styles.footer}>
        <span>AUTOTOOLS V.0.1.0</span>
      </footer>
    </div>
  )
}
