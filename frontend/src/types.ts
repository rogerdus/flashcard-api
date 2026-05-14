export interface Category {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Flashcard {
  id: string
  question: string
  answer: string
  categoryId: string
  createdAt: string
  updatedAt: string
}

export interface CreateFlashcardInput {
  question: string
  answer: string
  categoryId: string
}

export interface ToastData {
  message: string
  type: 'success' | 'error'
  id: number
}
