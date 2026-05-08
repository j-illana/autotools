import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import ConfirmModal from '../../components/ui/ConfirmModal'
import styles from './Users.module.css'
import type { User } from '../../types'
import { api } from '../../api/client'

type UserWithPassword = User & { password?: string }

export default function Users() {
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 5

  useEffect(() => {
    api.get<User[]>('/users')
      .then(setData)
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false))
  }, [])

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE)
  const paginated = data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  async function handleDelete(id: number) {
    await api.delete(`/users/${id}`)
    setData(prev => prev.filter(u => u.id !== id))
    setDeleteTarget(null)
  }

  function handleEdit(user: User) {
    setEditTarget(user)
    setShowModal(true)
  }

  async function handleSave(user: UserWithPassword) {
    if (editTarget) {
      await api.put(`/users/${user.id}`, user)
      setData(prev => prev.map(u => u.id === user.id ? { ...u, ...user } : u))
    } else {
      const res = await api.post<{ id: number }>('/users', user)
      setData(prev => [...prev, { ...user, id: res.id }])
    }
    setShowModal(false)
    setEditTarget(null)
  }

  if (loading) return <DashboardLayout><p style={{ padding: '2rem' }}>Cargando usuarios...</p></DashboardLayout>
  if (error) return <DashboardLayout><p style={{ padding: '2rem', color: 'var(--danger)' }}>Error: {error}</p></DashboardLayout>

  return (
    <DashboardLayout>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Gestión de Usuarios</h1>
          <button className={styles.addBtn} onClick={() => { setEditTarget(null); setShowModal(true) }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            Crear usuario
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <div className={styles.tableToolbar}>
            <button className={styles.filterBtn}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filtrar
            </button>
            <span className={styles.total}>Total: {data.length} usuarios</span>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>NOMBRE</th>
                <th>CORREO</th>
                <th>ROL</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(u => (
                <tr key={u.id}>
                  <td><span className={styles.badge}>#{u.id}</span></td>
                  <td>{u.name}</td>
                  <td className={styles.correo}>{u.email}</td>
                  <td>
                    <span className={`${styles.rolBadge} ${u.role === 'admin' ? styles.rolAdmin : styles.rolWorker}`}>
                      [{u.role.toUpperCase()}]
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => handleEdit(u)} title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button className={styles.deleteBtn} onClick={() => setDeleteTarget(u)} title="Eliminar">
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
              Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, data.length)} de {data.length} usuarios
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
        <UserModal
          user={editTarget}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditTarget(null) }}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="¿Eliminar usuario?"
          message={`Estás por eliminar a "${deleteTarget.name}". Esta acción no se puede deshacer.`}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </DashboardLayout>
  )
}

interface UserModalProps {
  user: User | null
  onSave: (user: UserWithPassword) => void
  onClose: () => void
}

type UserForm = Omit<User, 'id'> & { password: string }

function UserModal({ user, onSave, onClose }: UserModalProps) {
  const [form, setForm] = useState<UserForm>(
    user
      ? { name: user.name, email: user.email, role: user.role, password: '' }
      : { name: '', email: '', role: 'worker', password: '' }
  )

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data: UserWithPassword = user
      ? { ...user, ...form, ...(form.password ? {} : { password: undefined }) }
      : { id: 0, ...form }
    onSave(data)
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{user ? 'Editar usuario' : 'Crear usuario'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          {[
            { name: 'name' as keyof UserForm, label: 'Nombre', placeholder: 'Ana Torres' },
            { name: 'email' as keyof UserForm, label: 'Correo electrónico', placeholder: 'ana@autotools.com', type: 'email' },
            { name: 'password' as keyof UserForm, label: user ? 'Nueva contraseña (opcional)' : 'Contraseña', placeholder: '••••••••', type: 'password' },
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
                required={f.name !== 'password' || !user}
              />
            </div>
          ))}
          <div className={styles.field}>
            <label className={styles.label}>Rol</label>
            <select className={styles.input} name="role" value={form.role} onChange={handleChange}>
              <option value="worker">Trabajador</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.saveBtn}>{user ? 'Guardar cambios' : 'Crear'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
