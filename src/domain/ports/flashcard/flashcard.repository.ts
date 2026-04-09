import { FlashcardEntity } from "../../entities/flashcard/flashcard.entity";

export interface FlashcardRepository {
    create(data: {
        question: string;
        answer: string;
        categoryId: string;
    }): Promise<FlashcardEntity>;
    findAll(categoryId?: string): Promise<FlashcardEntity[]>;
    findById(id: string): Promise<FlashcardEntity | null>;
}