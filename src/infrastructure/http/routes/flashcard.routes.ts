import { Router, Request, Response } from 'express'
import { PrismaCategoryRepository } from '../../repositories/category.repository'
import { InMemoryEventBus } from '../../events/in-memory-event-bus'
import { CreateFlashcardHandler } from '../../../app/flashcards/commands/create-flashcard.handler'
import { ListFlashcardsHandler } from '../../../app/flashcards/queries/list-flashcards.handler'
import { CreateFlashcardCommand } from '../../../app/flashcards/commands/create-flashcard.command'
import { ListFlashcardsQuery } from '../../../app/flashcards/queries/list-flashcards.query'
import { CategoryNotFoundError } from '../../../domain/errors/category-not-found.error'
import { CategoryArchivedError } from '../../../domain/errors/category-archived.error'
import { DomainError } from '../../../domain/errors/domain.error'
import UuidGenerator from '../../adapters/uuid.generator'

const categoryRepository = new PrismaCategoryRepository()
const eventBus = new InMemoryEventBus()
const uuidGenerator = new UuidGenerator()

export const flashcardRoutes = Router()

// GET /flashcards
flashcardRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query
    const handler = new ListFlashcardsHandler()
    const result = await handler.handle(
      new ListFlashcardsQuery(
        typeof categoryId === 'string' ? categoryId : undefined
      )
    )
    res.json(result)
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
})

// POST /flashcards
flashcardRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const { question, answer, categoryId } = req.body
    const handler = new CreateFlashcardHandler(
      categoryRepository,
      uuidGenerator,
      eventBus
    )
    const id = await handler.handle(
      new CreateFlashcardCommand(question, answer, categoryId)
    )
    res.status(201).json({ id })
  } catch (error) {
    if (error instanceof CategoryNotFoundError) {
      return res.status(404).json({ message: error.message })
    }
    if (error instanceof CategoryArchivedError) {
      return res.status(409).json({ message: error.message })
    }
    if (error instanceof DomainError) {
      return res.status(400).json({ message: error.message })
    }
    res.status(500).json({ message: 'Internal server error' })
  }
})
