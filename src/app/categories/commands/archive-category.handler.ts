import { CategoryNotFoundError } from '../../../domain/errors/category-not-found.error'
import { CategoryRepository } from '../../../domain/ports/category/category.repository'
import { EventBus } from '../../../domain/ports/event-bus.port'
import { ArchiveCategoryCommand } from './archive-category.command'

export class ArchiveCategoryHandler {
  constructor (
    private readonly categoryRepository: CategoryRepository,
    private readonly eventBus: EventBus
  ) {}

  async handle (command: ArchiveCategoryCommand): Promise<void> {
    const category = await this.categoryRepository.findById(command.categoryId)
    if (!category) throw new CategoryNotFoundError(command.categoryId)

    category.archive()

    await this.categoryRepository.save(category)
    await this.eventBus.publish(category.pullEvents())
  }
}
