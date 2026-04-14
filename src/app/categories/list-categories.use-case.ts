import { CategoryRepository } from '../../domain/ports/category/category.repository'
import { Category } from '../../domain/entities/category/category.entity'

export class ListCategoriesUseCase {
  constructor (private readonly categoryRepository: CategoryRepository) {}

  async execute (): Promise<Category[]> {
    return this.categoryRepository.findAll()
  }
}
