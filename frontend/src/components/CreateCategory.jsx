import { useState } from 'react'
import { createCategory } from '../api'

export default function CreateCategory({ onCreated }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createCategory(name)
      setName('')
      onCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section">
      <h2 className="section-title">Nueva categoría</h2>
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
  )
}
