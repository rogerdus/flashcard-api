import { useState, useEffect } from 'react'
import { getFlashcards } from '../api'

export default function FlashcardList({ categoryId, refreshKey }) {
  const [flashcards, setFlashcards] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getFlashcards(categoryId)
      .then(setFlashcards)
      .catch(() => setError('No se pudieron cargar los flashcards'))
  }, [categoryId, refreshKey])

  if (error) return <div className="error">{error}</div>
  if (flashcards.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay flashcards en esta categoría.</p>
        <p>Crea uno nuevo usando el formulario de arriba.</p>
      </div>
    )
  }

  return (
    <div>
      {flashcards.map((fc) => (
        <div key={fc.id} className="flashcard">
          <div className="flashcard-question">{fc.question}</div>
          <div className="flashcard-answer">{fc.answer}</div>
        </div>
      ))}
    </div>
  )
}
