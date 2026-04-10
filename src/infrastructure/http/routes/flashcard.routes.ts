import { Router, Request, Response } from 'express'

import { PrismaFlashcardRepository } from '../../repositories/flashcard.repository'
import { PrismaCategoryRepository } from '../../repositories/category.repository'
import { ListFlashcardsUseCase } from '../../../app/flashcards/list-flashcards.use-case'
import { CreateFlashcardUseCase } from '../../../app/flashcards/create-flashcard-use-case'
import { CategoryNotFoundError } from '../../../domain/errors/category-not-found.error'
import { DomainError } from '../../../domain/errors/domain.error'
import { toFlashCardResponseDto } from '../dtos/flashcard.dto'
import { InMemoryEventBus } from '../../events/in-memory-event-bus'

const flashcardRepository = new PrismaFlashcardRepository()
const categoryRepository = new PrismaCategoryRepository()
const eventBus = new InMemoryEventBus()

export const flashcardRoutes = Router()

flashcardRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query
    const useCase = new ListFlashcardsUseCase(flashcardRepository)
    const flashcards = await useCase.execute(
      typeof categoryId === 'string' ? categoryId : undefined
    )
    res.json(flashcards.map(toFlashCardResponseDto))
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

// POST /flashcards
flashcardRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const { question, answer, categoryId } = req.body
    const useCase = new CreateFlashcardUseCase(
      flashcardRepository,
      categoryRepository,
      eventBus
    )
    const flashcard = await useCase.execute({ question, answer, categoryId })
    res.status(201).json(toFlashCardResponseDto(flashcard))
  } catch (error) {
    if (error instanceof CategoryNotFoundError) {
      return res.status(404).json({ message: error.message })
    }
    if (error instanceof DomainError) {
      return res.status(400).json({ message: error.message })
    }
    res.status(500).json({ message: 'Internal server error' })
  }
})
