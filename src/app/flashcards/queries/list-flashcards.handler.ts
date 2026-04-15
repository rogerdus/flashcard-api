import { prisma } from '../../../infrastructure/adapters/prisma'
import { ListFlashcardsQuery } from './list-flashcards.query'

export interface FlashcardListItemDto {
  id: string
  question: string
  answer: string
  categoryId: string
  categoryName: string
  createdAt: string
}

export class ListFlashcardsHandler {
  async handle (query: ListFlashcardsQuery): Promise<FlashcardListItemDto[]> {
    const rows = await prisma.flashcard.findMany({
      where: query.categoryId ? { categoryId: query.categoryId } : undefined,
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        question: true,
        answer: true,
        categoryId: true,
        createdAt: true,
        category: { select: { name: true } }
      }
    })

    return rows.map(row => ({
      id: row.id,
      question: row.question,
      answer: row.answer,
      categoryId: row.categoryId,
      categoryName: row.category.name,
      createdAt: row.createdAt.toISOString()
    }))
  }
}
