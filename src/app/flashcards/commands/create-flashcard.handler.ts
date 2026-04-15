import { CategoryRepository } from '../../../domain/ports/category/category.repository'
import { EventBus } from '../../../domain/ports/event-bus.port'
import { CategoryNotFoundError } from '../../../domain/errors/category-not-found.error'
import { CreateFlashcardCommand } from './create-flashcard.command'
import { generatorId } from '../../../domain/ports/generator-id/generator-id.port'

export class CreateFlashcardHandler {
  constructor (
    private readonly categoryRepository: CategoryRepository,
    private readonly generatorId: generatorId,
    private readonly eventBus: EventBus
  ) {}

  async handle (command: CreateFlashcardCommand): Promise<string> {
    const category = await this.categoryRepository.findById(command.categoryId)
    if (!category) {
      throw new CategoryNotFoundError(command.categoryId)
    }

    const flashcard = category.addFlashcard({
      id: this.generatorId.generateId(),
      question: command.question,
      answer: command.answer
    })

    await this.categoryRepository.save(category)
    await this.eventBus.publish(category.pullEvents())

    return flashcard.id
  }
}
