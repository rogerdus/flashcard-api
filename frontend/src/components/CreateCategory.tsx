import { useState, type FormEvent } from 'react'
import { createCategory } from '../api'

interface CreateCategoryProps {
  onCreated: () => void
}

export default function CreateCategory({ onCreated }: CreateCategoryProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createCategory(name)
      setName('')
      setShowForm(false)
      onCreated()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section">
      <button
        className="section-toggle"
        onClick={() => setShowForm((v) => !v)}
        aria-expanded={showForm}
      >
        <span className="section-toggle-icon">{showForm ? '▾' : '▸'}</span>
        <span>{showForm ? 'Cerrar formulario' : 'Nueva categoría'}</span>
        <span className="btn-badge">+</span>
      </button>
      {showForm && (
        <div className="section-toggle-body">
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="cat-name">Nombre</label>
              <input
                id="cat-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Matemáticas, Historia..."
                required
              />
            </div>
            <button className="btn btn-success" type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear categoría'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
