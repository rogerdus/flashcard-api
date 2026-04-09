import { Router, Request, Response } from 'express'

import { PrismaCategoryRepository } from '../../repositories/category.repository'
import { ListCategoriesUseCase } from '../../../app/categories/list-categories.use-case'
import { CreateCategoryUseCase } from '../../../app/categories/create-category.use-case'
import { CategoryAlreadyExistsError } from '../../../domain/errors/category-alredy-exist.error'
import { DomainError } from '../../../domain/errors/domain.error'

const categoryRepository = new PrismaCategoryRepository()

export const categoryRoutes = Router()

// GET /categories
categoryRoutes.get('/', async (_req: Request, res: Response) => {
  try {
    const useCase = new ListCategoriesUseCase(categoryRepository)
    const categories = await useCase.execute()
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

// POST /categories
categoryRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body
    const useCase = new CreateCategoryUseCase(categoryRepository)
    const category = await useCase.execute(name)
    res.status(201).json(category)
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
