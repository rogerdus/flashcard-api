import { useState, useEffect } from 'react'
import { getCategories } from '../api'

export default function CategoryList({ selectedCategoryId, onSelectCategory, refreshKey }) {
  const [categories, setCategories] = useState([])
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
