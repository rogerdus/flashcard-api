import { useState, useEffect } from 'react'
import { getFlashcards } from '../api'
import type { Flashcard } from '../types'

interface FlashcardListProps {
  categoryId: string | null
  refreshKey: number
}

export default function FlashcardList({ categoryId, refreshKey }: FlashcardListProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(new Set<string>())

  useEffect(() => {
    getFlashcards(categoryId ?? undefined)
      .then(setFlashcards)
      .catch(() => setError('No se pudieron cargar los flashcards'))
  }, [categoryId, refreshKey])

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = search.trim()
    ? flashcards.filter(
        (fc) =>
          fc.question.toLowerCase().includes(search.toLowerCase()) ||
          fc.answer.toLowerCase().includes(search.toLowerCase())
      )
    : flashcards

  if (error) return <div className="error">{error}</div>

  return (
    <div>
      {flashcards.length > 0 && (
        <div className="search-bar">
          <input
            type="text"
            placeholder={`Buscar en ${flashcards.length} flashcard${flashcards.length !== 1 ? 's' : ''}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>
              ✕
            </button>
          )}
        </div>
      )}

      {flashcards.length > 0 && search && filtered.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron flashcards para &quot;<strong>{search}</strong>&quot;</p>
        </div>
      )}

      {filtered.length === 0 && !search && (
        <div className="empty-state">
          <p>No hay flashcards en esta categoría.</p>
          <p className="empty-hint">Crea uno nuevo usando el formulario de arriba.</p>
        </div>
      )}

      {filtered.map((fc, i) => (
        <div
          key={fc.id}
          className={`flashcard ${expanded.has(fc.id) ? 'expanded' : ''}`}
          style={{ animationDelay: `${i * 0.04}s` }}
        >
          <button
            className="flashcard-header"
            onClick={() => toggleExpand(fc.id)}
            aria-expanded={expanded.has(fc.id)}
          >
            <span className="flashcard-question">{fc.question}</span>
            <span className={`expand-icon ${expanded.has(fc.id) ? 'rotated' : ''}`}>
              ▾
            </span>
          </button>
          <div className="flashcard-body">
            <div className="flashcard-answer">{fc.answer}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
