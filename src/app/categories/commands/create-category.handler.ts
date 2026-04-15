import { Category } from '../../../domain/entities/category/category.entity'
import { CategoryAlreadyExistsError } from '../../../domain/errors/category-alredy-exist.error'
import { CategoryRepository } from '../../../domain/ports/category/category.repository'
import { EventBus } from '../../../domain/ports/event-bus.port'
import { CreateCategoryCommand } from './create-category.command'
import { generatorId } from '../../../domain/ports/generator-id/generator-id.port'

export class CreateCategoryHandler {
  constructor (
    private readonly categoryRepository: CategoryRepository,
    private readonly generatorId: generatorId,
    private readonly eventBus: EventBus
  ) {}

  async handle (command: CreateCategoryCommand): Promise<string> {
    const exist = await this.categoryRepository.findByName(command.name?.trim())
    if (exist) throw new CategoryAlreadyExistsError(command.name)

    const category = Category.create({
      id: this.generatorId.generateId(),
      name: command.name
    })
    await this.categoryRepository.save(category)
    await this.eventBus.publish(category.pullEvents())

    return category.id
  }
}
