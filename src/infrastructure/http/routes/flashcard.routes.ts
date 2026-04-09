import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { PrismaFlashcardRepository } from '../../repositories/flashcard.repository'
import { PrismaCategoryRepository } from '../../repositories/category.repository'
import { ListFlashcardsUseCase } from '../../../app/flashcards/list-flashcards.use-case'
import { CreateFlashcardUseCase } from '../../../app/flashcards/create-flashcard-use-case'

const prisma = new PrismaClient()
const flashcardRepository = new PrismaFlashcardRepository(prisma)
const categoryRepository = new PrismaCategoryRepository(prisma)

export const flashcardRoutes = Router()

flashcardRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query
    const useCase = new ListFlashcardsUseCase(flashcardRepository)
    const flashcards = await useCase.execute(
      typeof categoryId === 'string' ? categoryId : undefined
    )
    res.json(flashcards)
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
      categoryRepository
    )
    const flashcard = await useCase.execute({ question, answer, categoryId })
    res.status(201).json(flashcard)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error'
    const status =
      message.includes('required') || message.includes('not found') ? 400 : 500
    res.status(status).json({ message })
  }
})
