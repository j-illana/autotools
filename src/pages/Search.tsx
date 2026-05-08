import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import styles from './Search.module.css'
import type { Product } from '../types'
import { api } from '../api/client'

const ITEMS_PER_PAGE = 5

function StockBar({ stock, minStock, maxStock }: { stock: number; minStock: number; maxStock: number }) {
  const pct = Math.min((stock / maxStock) * 100, 100)
  const color = stock === 0 ? 'var(--danger)' : stock <= minStock ? 'var(--warning)' : 'var(--accent)'
  return (
    <div className={styles.stockCell}>
      <span>{stock}</span>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

export default function Search() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    api.get<Product[]>('/products').then(setProducts).catch(console.error)
  }, [])

  const q = searchParams.get('q')?.toLowerCase() || ''
  const results = products.filter(p =>
    p.id.toLowerCase().includes(q) ||
    p.name.toLowerCase().includes(q)
  )

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE)
  const paginated = results.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setPage(1)
    navigate(`/busqueda?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Link to="/" className={styles.logoLink}>
          <span className={styles.logoIcon}>⊞</span>
          <div>
            <span className={styles.logo}>autoTools</span>
            <span className={styles.version}>V.0.1.0</span>
          </div>
        </Link>
      </header>

      <main className={styles.main}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchBtn}>BUSCAR</button>
          </div>
        </form>

        {results.length === 0 ? (
          <div className={styles.empty}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.emptyIcon}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            <h2 className={styles.emptyTitle}>Sin resultados</h2>
            <p className={styles.emptyMsg}>
              No encontramos autopartes que coincidan con tu búsqueda.<br />
              Intenta con otro término o código.
            </p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>CÓDIGO</th>
                  <th>NOMBRE</th>
                  <th>CATEGORÍA</th>
                  <th>STOCK</th>
                  <th>PRECIO</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(p => (
                  <tr key={p.id}>
                    <td><span className={styles.badge}>{p.id}</span></td>
                    <td>{p.name}</td>
                    <td className={styles.categoria}>{p.category}</td>
                    <td><StockBar stock={p.stock} minStock={p.min_stock} maxStock={p.max_stock} /></td>
                    <td className={styles.precio}>{p.price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.tableFooter}>
              <span className={styles.count}>
                Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, results.length)} de {results.length} {results.length === 1 ? 'producto' : 'productos'}
              </span>
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button className={styles.pageArrow} onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button key={n} className={`${styles.pageBtn} ${n === page ? styles.pageBtnActive : ''}`} onClick={() => setPage(n)}>{n}</button>
                  ))}
                  <button className={styles.pageArrow} onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>›</button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
