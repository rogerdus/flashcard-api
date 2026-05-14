import { useState, useEffect, useCallback, useReducer } from 'react'
import { getFlashcards, getCategories } from '../api'
import type { Flashcard, Category } from '../types'

interface StudyState {
  flashcards: Flashcard[]
  currentIndex: number
  flipped: boolean
  loading: boolean
  error: string
}

type StudyAction =
  | { type: 'LOADING' }
  | { type: 'LOADED'; flashcards: Flashcard[] }
  | { type: 'ERROR'; error: string }
  | { type: 'FLIP' }
  | { type: 'PREV' }
  | { type: 'NEXT' }

function studyReducer(state: StudyState, action: StudyAction): StudyState {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: '', currentIndex: 0, flipped: false }
    case 'LOADED':
      return { ...state, loading: false, flashcards: action.flashcards }
    case 'ERROR':
      return { ...state, loading: false, error: action.error }
    case 'FLIP':
      return { ...state, flipped: !state.flipped }
    case 'PREV':
      return { ...state, flipped: false, currentIndex: state.currentIndex - 1 }
    case 'NEXT':
      return { ...state, flipped: false, currentIndex: state.currentIndex + 1 }
  }
}

const initialState: StudyState = {
  flashcards: [],
  currentIndex: 0,
  flipped: false,
  loading: true,
  error: '',
}

export default function StudyView() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState('')
  const [state, dispatch] = useReducer(studyReducer, initialState)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {})
  }, [])

  useEffect(() => {
    let ignore = false
    dispatch({ type: 'LOADING' })
    getFlashcards(categoryId || undefined)
      .then((data) => {
        if (!ignore) dispatch({ type: 'LOADED', flashcards: data })
      })
      .catch(() => {
        if (!ignore) dispatch({ type: 'ERROR', error: 'Error al cargar flashcards' })
      })
    return () => { ignore = true }
  }, [categoryId])

  const { flashcards, currentIndex, flipped, loading, error } = state

  const goNext = useCallback(() => {
    if (currentIndex < flashcards.length - 1) dispatch({ type: 'NEXT' })
  }, [currentIndex, flashcards.length])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) dispatch({ type: 'PREV' })
  }, [currentIndex])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        if (!flipped) dispatch({ type: 'FLIP' })
        else goNext()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
      if (e.key === 'Enter' || e.key === 'f') {
        e.preventDefault()
        dispatch({ type: 'FLIP' })
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [flipped, goNext, goPrev])

  if (error) return <div className="error">{error}</div>

  const card = flashcards[currentIndex]
  const progress = flashcards.length > 0 ? ((currentIndex + 1) / flashcards.length) * 100 : 0

  return (
    <div className="study-container">
      <div className="section">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="study-category">
            Categoría
          </label>
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

      {loading && (
        <div className="section" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading-spinner" />
          <p style={{ color: 'var(--gray-400)', marginTop: '1rem' }}>Cargando flashcards...</p>
        </div>
      )}

      {!loading && flashcards.length === 0 && (
        <div className="section">
          <div className="empty-state">
            <p>No hay flashcards para estudiar.</p>
            <p className="empty-hint">Crea algunos en la pestaña Flashcards.</p>
          </div>
        </div>
      )}

      {!loading && flashcards.length > 0 && (
        <div className="fade-in" key={currentIndex}>
          <div className="study-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-text">{currentIndex + 1}/{flashcards.length}</span>
          </div>

          <div
            className={`flashcard-card ${flipped ? 'flipped' : ''}`}
            onClick={() => dispatch({ type: 'FLIP' })}
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
              onClick={goPrev}
            >
              <span className="btn-arrow">←</span> Anterior
            </button>
            <button
              className="btn btn-primary"
              disabled={currentIndex === flashcards.length - 1}
              onClick={goNext}
            >
              Siguiente <span className="btn-arrow">→</span>
            </button>
          </div>

          <div className="keyboard-hint">
            <kbd>←</kbd> <kbd>→</kbd> navegar &middot; <kbd>Enter</kbd> <kbd>F</kbd> voltear &middot; <kbd>Space</kbd> voltear y seguir
          </div>
        </div>
      )}
    </div>
  )
}
