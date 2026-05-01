import DashboardLayout from '../../components/layout/DashboardLayout'
import productos from '../../data/productos.json'
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
  const total = productos.length
  const stockBajo = productos.filter(p => p.stock <= 20).length
  const sinStock = productos.filter(p => p.stock === 0).length
  const valorTotal = productos.reduce((acc, p) => acc + p.precio * p.stock, 0)

  const porCategoria = productos.reduce<Record<string, number>>((acc, p) => {
    acc[p.categoria] = (acc[p.categoria] || 0) + 1
    return acc
  }, {})

  return (
    <DashboardLayout>
      <div className={styles.page}>
        <h1 className={styles.title}>Reportes</h1>

        <div className={styles.stats}>
          <StatCard label="Total de productos" value={total} />
          <StatCard label="Stock bajo (≤20)" value={stockBajo} color="var(--warning)" sub="productos en alerta" />
          <StatCard label="Sin stock" value={sinStock} color="var(--danger)" sub="productos agotados" />
          <StatCard label="Valor del inventario" value={valorTotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} color="var(--accent)" />
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
                {Object.entries(porCategoria).map(([cat, qty]) => (
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
                {productos.filter(p => p.stock <= 20).map(p => (
                  <tr key={p.id}>
                    <td><span className={styles.badge}>{p.id}</span></td>
                    <td>{p.nombre}</td>
                    <td className={styles.qty}>{p.stock}</td>
                    <td>
                      <span className={`${styles.alertBadge} ${p.stock === 0 ? styles.alertRed : styles.alertYellow}`}>
                        {p.stock === 0 ? 'Sin stock' : 'Stock bajo'}
                      </span>
                    </td>
                  </tr>
                ))}
                {productos.filter(p => p.stock <= 20).length === 0 && (
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
