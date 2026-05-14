import { Category } from '../../domain/entities/category/category.entity'
import { CategoryAlreadyExistsError } from '../../domain/errors/category-alredy-exist.error'
import { CategoryRepository } from '../../domain/ports/category/category.repository'
import { EventBus } from '../../domain/ports/event-bus.port'

export class CreateCategoryUseCase {
  constructor (
    private readonly categoryRepository: CategoryRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute (name: string): Promise<Category> {
    const exist = await this.categoryRepository.findByName(name?.trim())
    if (exist) {
      throw new CategoryAlreadyExistsError(name)
    }

    const category = Category.create({ id: crypto.randomUUID(), name })

    await this.categoryRepository.save(category)

    await this.eventBus.publish(category.pullEvents())

    return category
  }
}
