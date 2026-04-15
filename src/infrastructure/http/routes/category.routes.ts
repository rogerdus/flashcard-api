import { Router, Request, Response } from 'express'

import UuidGenerator from '../../adapters/uuid.generator'
import { DomainError } from '../../../domain/errors/domain.error'
import { InMemoryEventBus } from '../../events/in-memory-event-bus'
import { PrismaCategoryRepository } from '../../repositories/category.repository'
import { ListCategoriesQuery } from '../../../app/categories/queries/list-categories.query'
import { CategoryAlreadyExistsError } from '../../../domain/errors/category-alredy-exist.error'
import { ListCategoriesHandler } from '../../../app/categories/queries/list-categories.handler'
import { CreateCategoryHandler } from '../../../app/categories/commands/create-category.handler'
import { CreateCategoryCommand } from '../../../app/categories/commands/create-category.command'
import { ArchiveCategoryHandler } from '../../../app/categories/commands/archive-category.handler'
import { ArchiveCategoryCommand } from '../../../app/categories/commands/archive-category.command'
import { CategoryNotFoundError } from '../../../domain/errors/category-not-found.error'
import { CategoryArchivedError } from '../../../domain/errors/category-archived.error'

const categoryRepository = new PrismaCategoryRepository()
const uuidGenerator = new UuidGenerator()
export const categoryRoutes = Router()
const eventBus = new InMemoryEventBus()

// GET /categories
categoryRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const includedArchived = req.query.includeArchived === 'true'
    const handler = new ListCategoriesHandler()
    const result = await handler.handle(
      new ListCategoriesQuery(includedArchived)
    )

    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

// POST /categories
categoryRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body
    const handler = new CreateCategoryHandler(
      categoryRepository,
      uuidGenerator,
      eventBus
    )

    const id = await handler.handle(new CreateCategoryCommand(name))

    res.status(201).json({ id })
  } catch (error) {
    //TODO implement error handler
    if (error instanceof CategoryAlreadyExistsError) {
      return res.status(409).json({ message: error.message })
    }
    if (error instanceof DomainError) {
      return res.status(400).json({ message: error.message })
    }
    res.status(500).json({ message: 'Internal server error' })
  }
})

categoryRoutes.delete('/:id', async (req: Request, res: Response) => {
  try {
    const handler = new ArchiveCategoryHandler(categoryRepository, eventBus)
    await handler.handle(new ArchiveCategoryCommand(req.params.id))

    res.status(204).send()
  } catch (error) {
    if (error instanceof CategoryNotFoundError) {
      return res.status(404).json({ message: error.message })
    }
    if (error instanceof CategoryArchivedError) {
      return res.status(409).json({ message: error.message })
    }
    res.status(500).json({ message: 'Internal server error' })
  }
})
