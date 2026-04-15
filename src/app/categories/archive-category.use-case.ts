import { CategoryRepository } from "../../domain/ports/category/category.repository";
import { EventBus } from "../../domain/ports/event-bus.port";
import { CategoryNotFoundError } from "../../domain/errors/category-not-found.error";

export class ArchiveCategoryUseCase {
    constructor(
        private readonly categoryRepository: CategoryRepository,
        private readonly eventBus: EventBus,
    ) {}

    async execute(categoryId: string): Promise<void> {
        const category = await this.categoryRepository.findById(categoryId);
        if (!category) {
            throw new CategoryNotFoundError(categoryId);
        }

        category.archive();

        await this.categoryRepository.save(category);
        await this.eventBus.publish(category.pullEvents());
    }
}