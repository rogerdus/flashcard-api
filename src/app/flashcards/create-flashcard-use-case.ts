import { FlashcardRepository } from "../../domain/ports/flashcard/flashcard.repository";
import { CategoryRepository } from "../../domain/ports/category/category.repository";
import { FlashcardEntity } from "../../domain/entities/flashcard/flashcard.entity";

///TODO CREATE DTO FIRST VERSION 
interface CreateFlashcardInput {
    question: string;
    answer: string;
    categoryId: string;
}

export class CreateFlashcardUseCase {
    constructor(
        private readonly flashcardRepository: FlashcardRepository,
        private readonly categoryRepository: CategoryRepository
    ) {}

    async execute(input: CreateFlashcardInput): Promise<FlashcardEntity> {
        const { question, answer, categoryId } = input;

        if (!question || question.trim().length === 0) {
            throw new Error("Question is required");
        }
        if (!answer || answer.trim().length === 0) {
            throw new Error("Answer is required");
        }
        if (!categoryId) {
            throw new Error("Category ID is required");
        }

        const category = await this.categoryRepository.findById(categoryId);
        if (!category) {
            throw new Error(`Category with id "${categoryId}" not found`);
        }

        return this.flashcardRepository.create({
            question: question.trim(),
            answer: answer.trim(),
            categoryId,
        });
    }
}