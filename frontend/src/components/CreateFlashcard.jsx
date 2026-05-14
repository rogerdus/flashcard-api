import { useState, useEffect } from 'react'
import { createFlashcard, getCategories } from '../api'

export default function CreateFlashcard({ onCreated, preselectedCategoryId }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [categoryId, setCategoryId] = useState(preselectedCategoryId || '')
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setError('No se pudieron cargar las categorías'))
  }, [])

  useEffect(() => {
    if (preselectedCategoryId) setCategoryId(preselectedCategoryId)
  }, [preselectedCategoryId])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createFlashcard({ question, answer, categoryId })
      setQuestion('')
      setAnswer('')
      onCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section">
      <h2 className="section-title">Nuevo flashcard</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fc-question">Pregunta</label>
          <textarea
            id="fc-question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="¿Cuál es la capital de Francia?"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fc-answer">Respuesta</label>
          <textarea
            id="fc-answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="París"
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
  )
}
