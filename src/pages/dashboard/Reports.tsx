import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { api } from '../../api/client'
import type { Product } from '../../types'
import styles from './Reports.module.css'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  color?: string
}

function StatCard({ label, value, sub, color }: StatCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.cardLabel}>{label}</span>
      <span className={styles.cardValue} style={{ color }}>{value}</span>
      {sub && <span className={styles.cardSub}>{sub}</span>}
    </div>
  )
}

export default function Reports() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Product[]>('/products')
      .then((data: Product[]) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const total = products.length
  const lowStock = products.filter(p => p.stock <= p.min_stock && p.stock > 0)
  const outOfStock = products.filter(p => p.stock === 0)
  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0)

  const byCategory = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {})

  const stockAlerts = products.filter(p => p.stock <= p.min_stock)

  if (loading) {
    return (
      <DashboardLayout>
        <div className={styles.page}>
          <p>Cargando reportes...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className={styles.page}>
        <h1 className={styles.title}>Reportes</h1>

        <div className={styles.stats}>
          <StatCard label="Total de productos" value={total} />
          <StatCard label="Stock bajo" value={lowStock.length} color="var(--warning)" sub="productos en alerta" />
          <StatCard label="Sin stock" value={outOfStock.length} color="var(--danger)" sub="productos agotados" />
          <StatCard label="Valor del inventario" value={totalValue.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} color="var(--accent)" />
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Productos por categoría</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>CATEGORÍA</th>
                  <th>CANTIDAD</th>
                  <th>PROPORCIÓN DEL INVENTARIO</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(byCategory).map(([cat, qty]) => (
                  <tr key={cat}>
                    <td className={styles.catName}>{cat}</td>
                    <td className={styles.qty}>{qty}</td>
                    <td>
                      <div className={styles.barTrack}>
                        <div className={styles.barFill} style={{ width: `${(qty / total) * 100}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Alertas de stock</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>CÓDIGO</th>
                  <th>NOMBRE</th>
                  <th>STOCK</th>
                  <th>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {stockAlerts.map(p => (
                  <tr key={p.id}>
                    <td><span className={styles.badge}>{p.id}</span></td>
                    <td>{p.name}</td>
                    <td className={styles.qty}>{p.stock}</td>
                    <td>
                      <span className={`${styles.alertBadge} ${p.stock === 0 ? styles.alertRed : styles.alertYellow}`}>
                        {p.stock === 0 ? 'Sin stock' : 'Stock bajo'}
                      </span>
                    </td>
                  </tr>
                ))}
                {stockAlerts.length === 0 && (
                  <tr><td colSpan={4} className={styles.empty}>Sin alertas activas</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
