import type { Category, Flashcard, CreateFlashcardInput } from './types'

const BASE_URL = ''

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/categories`)
  if (!res.ok) throw new Error('Error al cargar categorías')
  return res.json()
}

export async function createCategory(name: string): Promise<Category> {
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

export async function getFlashcards(categoryId?: string): Promise<Flashcard[]> {
  const params = categoryId ? `?categoryId=${categoryId}` : ''
  const res = await fetch(`${BASE_URL}/flashcards${params}`)
  if (!res.ok) throw new Error('Error al cargar flashcards')
  return res.json()
}

export async function createFlashcard(input: CreateFlashcardInput): Promise<Flashcard> {
  const res = await fetch(`${BASE_URL}/flashcards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message)
  }
  return res.json()
}
