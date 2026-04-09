import { CategoryRepository } from '../../domain/ports/category/category.repository'
import { CategoryEntity } from '../../domain/entities/category/category.entity'

export class ListCategoriesUseCase {
  constructor (private readonly categoryRepository: CategoryRepository) {}

  async execute (): Promise<CategoryEntity[]> {
    return this.categoryRepository.findAll()
  }
}
