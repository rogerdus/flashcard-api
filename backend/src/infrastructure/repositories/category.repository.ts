import { prisma } from '../adapters/prisma'

import { CategoryRepository } from '../../domain/ports/category/category.repository'
import { Category } from '../../domain/entities/category/category.entity'

export class PrismaCategoryRepository implements CategoryRepository {
  constructor () {}

  async save (category: Category): Promise<Category> {
    const raw = await prisma.category.upsert({
      where: { id: category.id },
      create: {
        id: category.id,
        name: category.name
      },
      update: {
        name: category.name
      }
    })

    for (const flashcard of category.flashcards) {
      await prisma.flashcard.upsert({
        where: { id: flashcard.id },
        create: {
          id: flashcard.id,
          question: flashcard.question,
          answer: flashcard.answer,
          categoryId: flashcard.categoryId,
          createdAt: flashcard.createdAt,
          updatedAt: flashcard.updatedAt
        },
        update: {
          question: flashcard.question,
          answer: flashcard.answer
        }
      })
    }

    return Category.fromPrimitives(raw)
  }

  async findAll (): Promise<Category[]> {
    const rows = await prisma.category.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    })
    return rows.map(Category.fromPrimitives)
  }

  async findById (id: string): Promise<Category | null> {
    const raw = await prisma.category.findUnique({
      where: { id },
      include: {
        flashcards: true
      }
    });
    return raw ? Category.fromPrimitives(raw) : null
  }

  async findByName (name: string): Promise<Category | null> {
    const raw = await prisma.category.findUnique({ where: { name } })
    return raw ? Category.fromPrimitives(raw) : null
  }
}
