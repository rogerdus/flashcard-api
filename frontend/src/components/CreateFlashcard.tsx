import { useState, useEffect, type FormEvent } from 'react'
import { createFlashcard, getCategories } from '../api'
import type { Category } from '../types'

interface CreateFlashcardProps {
  onCreated: () => void
  preselectedCategoryId: string | null
}

export default function CreateFlashcard({ onCreated, preselectedCategoryId }: CreateFlashcardProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [categoryId, setCategoryId] = useState(preselectedCategoryId ?? '')
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setError('No se pudieron cargar las categorías'))
  }, [])

  if (preselectedCategoryId && preselectedCategoryId !== categoryId) {
    setCategoryId(preselectedCategoryId)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createFlashcard({ question, answer, categoryId })
      setQuestion('')
      setAnswer('')
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
        <span>{showForm ? 'Cerrar formulario' : 'Nuevo flashcard'}</span>
        <span className="btn-badge">+</span>
      </button>
      {showForm && (
        <div className="section-toggle-body">
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fc-question">Pregunta</label>
              <textarea
                id="fc-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ej: ¿Cuál es la capital de Francia?"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="fc-answer">Respuesta</label>
              <textarea
                id="fc-answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Ej: París"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="fc-category">Categoría</label>
              <select
                id="fc-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear flashcard'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
