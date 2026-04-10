import { prisma } from '../adapters/prisma'
import { FlashcardRepository } from '../../domain/ports/flashcard/flashcard.repository'
import { FlashCard } from '../../domain/entities/flashcard/flashcard.entity'

export class PrismaFlashcardRepository implements FlashcardRepository {
  constructor () {}

  async save (flashcard: FlashCard): Promise<FlashCard> {
    const raw = await prisma.flashcard.create({
      data: {
        id: flashcard.id,
        question: flashcard.question,
        answer: flashcard.answer,
        categoryId: flashcard.categoryId
      }
    })
    return FlashCard.fromPrimitives(raw)
  }

  async findAll (categoryId: string): Promise<FlashCard[]> {
    const rows = await prisma.flashcard.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: { createdAt: 'asc' }
    })
    return rows.map(FlashCard.fromPrimitives)
  }

  async findById (id: string): Promise<FlashCard | null> {
    const raw = await prisma.flashcard.findUnique({ where: { id } })
    return raw ? FlashCard.fromPrimitives(raw) : null
  }
}
