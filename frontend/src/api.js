const BASE_URL = ''

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/categories`)
  if (!res.ok) throw new Error('Error al cargar categorías')
  return res.json()
}

export async function createCategory(name) {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message)
  }
  return res.json()
}

export async function getFlashcards(categoryId) {
  const params = categoryId ? `?categoryId=${categoryId}` : ''
  const res = await fetch(`${BASE_URL}/flashcards${params}`)
  if (!res.ok) throw new Error('Error al cargar flashcards')
  return res.json()
}

export async function createFlashcard({ question, answer, categoryId }) {
  const res = await fetch(`${BASE_URL}/flashcards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, answer, categoryId }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message)
  }
  return res.json()
}
