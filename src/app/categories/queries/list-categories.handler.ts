import { prisma } from '../../../infrastructure/adapters/prisma'
import { ListCategoriesQuery } from './list-categories.query'

export interface CategoryListItemDto {
  id: string
  name: string
  flashcardCount: number
  isArchived: boolean
  createdAt: string
}

export class ListCategoriesHandler {
  async handle (query: ListCategoriesQuery): Promise<CategoryListItemDto[]> {
    const rows = await prisma.category.findMany({
      where: query.includeArchived ? undefined : { archivedAt: null },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
        archivedAt: true,
        _count: { select: { flashcards: true } }
      }
    })

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      flashcardCount: row._count.flashcards,
      isArchived: row.archivedAt !== null,
      createdAt: row.createdAt.toISOString()
    }))
  }
}
