import { Category } from '../../domain/entities/category/category.entity'
import { CategoryAlreadyExistsError } from '../../domain/errors/category-alredy-exist.error'
import { CategoryRepository } from '../../domain/ports/category/category.repository'

export class CreateCategoryUseCase {
  constructor (private readonly categoryRepository: CategoryRepository) {}

  async execute (name: string): Promise<Category> {
    const exist = await this.categoryRepository.findByName(name?.trim())
    if (exist) {
        throw new CategoryAlreadyExistsError(name)
    }

    const category = Category.create({ id: crypto.randomUUID(), name })
    return this.categoryRepository.save(category)
  }
}
