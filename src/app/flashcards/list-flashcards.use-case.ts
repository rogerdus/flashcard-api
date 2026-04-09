import { FlashcardRepository } from "../../domain/ports/flashcard/flashcard.repository";
import { FlashcardEntity } from "../../domain/entities/flashcard/flashcard.entity";

export class ListFlashcardsUseCase {
    constructor(private readonly flashcardRepository: FlashcardRepository) {}

    async execute(categoryId?: string): Promise<FlashcardEntity[]> {
        return this.flashcardRepository.findAll(categoryId);
    }
}