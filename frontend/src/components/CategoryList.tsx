import { useState, useEffect } from 'react'
import { getCategories } from '../api'
import type { Category } from '../types'

interface CategoryListProps {
  selectedCategoryId: string | null
  onSelectCategory: (id: string | null) => void
  refreshKey: number
}

export default function CategoryList({ selectedCategoryId, onSelectCategory, refreshKey }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setError('No se pudieron cargar las categorías'))
  }, [refreshKey])

  if (error) return <div className="error">{error}</div>

  return (
    <div className="category-list">
      <button
        className={`category-badge ${!selectedCategoryId ? 'active' : ''}`}
        onClick={() => onSelectCategory(null)}
      >
        Todas
        <span className="category-count">{categories.length}</span>
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`category-badge ${selectedCategoryId === cat.id ? 'active' : ''}`}
          onClick={() => onSelectCategory(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
