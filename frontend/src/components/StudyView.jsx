import { useState, useEffect } from 'react'
import { getFlashcards, getCategories } from '../api'

export default function StudyView() {
  const [flashcards, setFlashcards] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setError('Error al cargar categorías'))
  }, [])

  useEffect(() => {
    setLoading(true)
    setFlipped(false)
    setCurrentIndex(0)
    getFlashcards(categoryId || undefined)
      .then((data) => {
        setFlashcards(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Error al cargar flashcards')
        setLoading(false)
      })
  }, [categoryId])

  if (error) return <div className="error">{error}</div>

  const card = flashcards[currentIndex]

  return (
    <div className="study-container">
      <div className="section">
        <div className="form-group">
          <label htmlFor="study-category">Selecciona una categoría</label>
          <select
            id="study-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="empty-state"><p>Cargando...</p></div>}

      {!loading && flashcards.length === 0 && (
        <div className="empty-state">
          <p>No hay flashcards para estudiar.</p>
          <p>Crea algunos en la pestaña Flashcards.</p>
        </div>
      )}

      {!loading && flashcards.length > 0 && (
        <>
          <div className="study-progress">
            {currentIndex + 1} / {flashcards.length}
          </div>

          <div
            className={`flashcard-card ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className="flashcard-inner">
              <div className="flashcard-front">
                <div className="flashcard-label">Pregunta</div>
                <div className="flashcard-content">{card.question}</div>
                <div className="flashcard-hint">Toca para ver la respuesta</div>
              </div>
              <div className="flashcard-back">
                <div className="flashcard-label">Respuesta</div>
                <div className="flashcard-content">{card.answer}</div>
                <div className="flashcard-hint">Toca para ocultar</div>
              </div>
            </div>
          </div>

          <div className="study-nav">
            <button
              className="btn btn-primary"
              disabled={currentIndex === 0}
              onClick={() => {
                setFlipped(false)
                setCurrentIndex((i) => i - 1)
              }}
            >
              Anterior
            </button>
            <button
              className="btn btn-primary"
              disabled={currentIndex === flashcards.length - 1}
              onClick={() => {
                setFlipped(false)
                setCurrentIndex((i) => i + 1)
              }}
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {!loading && flashcards.length > 0 && currentIndex === flashcards.length - 1 && flipped && (
        <div className="success" style={{ textAlign: 'center', marginTop: '1rem' }}>
          Última tarjeta de esta categoría
        </div>
      )}
    </div>
  )
}
