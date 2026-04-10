import { FlashcardRepository } from "../../domain/ports/flashcard/flashcard.repository";
import { CategoryRepository } from "../../domain/ports/category/category.repository";
import { FlashCard } from "../../domain/entities/flashcard/flashcard.entity";
import { CategoryNotFoundError } from "../../domain/errors/category-not-found.error";
import { EventBus } from "../../domain/ports/event-bus.port";

///TODO CREATE DTO FIRST VERSION 
interface CreateFlashcardInput {
    question: string;
    answer: string;
    categoryId: string;
}

export class CreateFlashcardUseCase {
    constructor(
        private readonly flashcardRepository: FlashcardRepository,
        private readonly categoryRepository: CategoryRepository,
        private readonly eventBus: EventBus
    ) {}

    async execute(input: CreateFlashcardInput): Promise<FlashCard> {
        const category = await this.categoryRepository.findById(input.categoryId);
        if (!category) {
            throw new CategoryNotFoundError(input.categoryId);
        }
        const flashcard = FlashCard.create({id: crypto.randomUUID(), ...input});

        await this.flashcardRepository.save(flashcard);

        await this.eventBus.publish(flashcard.pullEvent());

        return flashcard;
    }
}