import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import ConfirmModal from '../../components/ui/ConfirmModal'
import styles from './Inventory.module.css'
import type { Product } from '../../types'
import { api } from '../../api/client'

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

export default function Inventory() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [stockStatus, setStockStatus] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.get<Product[]>('/products')
      .then(setData)
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false))
  }, [])

  const categories = [...new Set(data.map(p => p.category))]

  const filtered = data.filter(p => {
    const matchQuery = p.id.toLowerCase().includes(query.toLowerCase()) ||
      p.name.toLowerCase().includes(query.toLowerCase())
    const matchCat = category ? p.category === category : true
    const matchStock = stockStatus === 'low' ? p.stock <= p.min_stock
      : stockStatus === 'out' ? p.stock === 0
      : true
    return matchQuery && matchCat && matchStock
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  async function handleDelete(id: string) {
    await api.delete(`/products/${id}`)
    setData(prev => prev.filter(p => p.id !== id))
    setDeleteTarget(null)
  }

  function handleEdit(product: Product) {
    setEditTarget(product)
    setShowModal(true)
  }

  function handleAdd() {
    setEditTarget(null)
    setShowModal(true)
  }

  async function handleSave(product: Product) {
    if (editTarget) {
      await api.put(`/products/${product.id}`, product)
      setData(prev => prev.map(p => p.id === product.id ? product : p))
    } else {
      await api.post('/products', product)
      setData(prev => [...prev, product])
    }
    setShowModal(false)
    setEditTarget(null)
  }

  if (loading) return <DashboardLayout><p style={{ padding: '2rem' }}>Cargando inventario...</p></DashboardLayout>
  if (error) return <DashboardLayout><p style={{ padding: '2rem', color: 'var(--danger)' }}>Error: {error}</p></DashboardLayout>

  return (
    <DashboardLayout>
      <div className={styles.page}>
        <h1 className={styles.title}>Inventario de Autopartes</h1>

        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className={styles.searchInput}
              placeholder="Buscar por código, nombre..."
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1) }}
            />
          </div>

          <select className={styles.select} value={category} onChange={e => { setCategory(e.target.value); setPage(1) }}>
            <option value="">Todas las Categorías</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select className={styles.select} value={stockStatus} onChange={e => { setStockStatus(e.target.value); setPage(1) }}>
            <option value="">Estado de Stock</option>
            <option value="low">Stock bajo</option>
            <option value="out">Sin stock</option>
          </select>

          <button className={styles.addBtn} onClick={handleAdd}>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Agregar producto
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>CÓDIGO</th>
                <th>NOMBRE</th>
                <th>CATEGORÍA</th>
                <th>STOCK</th>
                <th>PRECIO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.empty}>Sin resultados</td>
                </tr>
              ) : paginated.map(p => (
                <tr key={p.id}>
                  <td><span className={styles.badge}>{p.id}</span></td>
                  <td>{p.name}</td>
                  <td className={styles.categoria}>{p.category}</td>
                  <td><StockBar stock={p.stock} minStock={p.min_stock} maxStock={p.max_stock} /></td>
                  <td className={styles.precio}>{p.price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => handleEdit(p)} title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button className={styles.deleteBtn} onClick={() => setDeleteTarget(p)} title="Eliminar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.tableFooter}>
            <span className={styles.count}>
              Mostrando {filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length} productos
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
      </div>

      {showModal && (
        <ProductModal
          product={editTarget}
          categories={categories}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditTarget(null) }}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="¿Eliminar producto?"
          message={`Estás por eliminar "${deleteTarget.name}". Esta acción no se puede deshacer.`}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </DashboardLayout>
  )
}

interface ProductModalProps {
  product: Product | null
  categories: string[]
  onSave: (product: Product) => void
  onClose: () => void
}

type ProductForm = Omit<Product, 'stock' | 'price' | 'min_stock' | 'max_stock'> & {
  stock: string | number
  price: string | number
  min_stock: string | number
  max_stock: string | number
}

function ProductModal({ product, categories, onSave, onClose }: ProductModalProps) {
  const [form, setForm] = useState<ProductForm>(
    product ?? { id: '', name: '', category: '', stock: '', min_stock: '', max_stock: '', price: '' }
  )
  const [newCategory, setNewCategory] = useState('')

  const isNewCategory = form.category === '__nueva__'

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const category = isNewCategory ? newCategory.trim() : form.category
    if (!category) return
    onSave({
      ...form,
      category,
      stock: Number(form.stock),
      price: Number(form.price),
      min_stock: Number(form.min_stock),
      max_stock: Number(form.max_stock),
    })
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{product ? 'Editar producto' : 'Agregar producto'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          {[
            { name: 'id' as keyof ProductForm, label: 'Código', placeholder: 'ENG-202', disabled: !!product },
            { name: 'name' as keyof ProductForm, label: 'Nombre', placeholder: 'Bujía de Iridio NGK' },
            { name: 'stock' as keyof ProductForm, label: 'Stock', placeholder: '0', type: 'number' },
            { name: 'min_stock' as keyof ProductForm, label: 'Stock mínimo', placeholder: '5', type: 'number' },
            { name: 'max_stock' as keyof ProductForm, label: 'Stock máximo', placeholder: '150', type: 'number' },
            { name: 'price' as keyof ProductForm, label: 'Precio (MXN)', placeholder: '0.00', type: 'number' },
          ].map(f => (
            <div className={styles.field} key={f.name}>
              <label className={styles.label}>{f.label}</label>
              <input
                className={styles.input}
                name={f.name}
                type={f.type || 'text'}
                placeholder={f.placeholder}
                value={form[f.name]}
                onChange={handleChange}
                disabled={f.disabled}
                required
                min={f.type === 'number' ? 0 : undefined}
                step={f.name === 'price' ? '0.01' : undefined}
              />
            </div>
          ))}
          <div className={styles.field}>
            <label className={styles.label}>Categoría</label>
            <select className={styles.input} name="category" value={form.category} onChange={handleChange} required>
              <option value="">Seleccionar...</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
              <option value="__nueva__">+ Nueva categoría</option>
            </select>
          </div>
          {isNewCategory && (
            <div className={styles.field}>
              <label className={styles.label}>Nombre de la nueva categoría</label>
              <input
                className={styles.input}
                type="text"
                placeholder="Ej: Suspensión"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                required
                autoFocus
              />
            </div>
          )}
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.saveBtn}>{product ? 'Guardar cambios' : 'Agregar'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
