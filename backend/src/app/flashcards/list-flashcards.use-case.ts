import { FlashcardRepository } from "../../domain/ports/flashcard/flashcard.repository";
import { FlashCard } from "../../domain/entities/flashcard/flashcard.entity";

export class ListFlashcardsUseCase {
    constructor(private readonly flashcardRepository: FlashcardRepository) {}

    async execute(categoryId?: string): Promise<FlashCard[]> {
        return this.flashcardRepository.findAll(categoryId);
    }
}