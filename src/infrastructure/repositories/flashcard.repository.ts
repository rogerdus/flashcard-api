import { PrismaClient } from "@prisma/client";
import { FlashcardRepository } from "../../domain/ports/flashcard/flashcard.repository";
import { FlashcardEntity } from "../../domain/entities/flashcard/flashcard.entity";

export class PrismaFlashcardRepository implements FlashcardRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(data: {
        question: string;
        answer: string;
        categoryId: string;
    }): Promise<FlashcardEntity> {
        const flashcard = await this.prisma.flashcard.create({ data });
        return this.toEntity(flashcard);
    }

    async findAll(categoryId?: string): Promise<FlashcardEntity[]> {
        const flashcards = await this.prisma.flashcard.findMany({
            where: categoryId ? { categoryId } : undefined,
            orderBy: { createdAt: "asc" },
        });
        return flashcards.map(this.toEntity);
    }

    async findById(id: string): Promise<FlashcardEntity | null> {
        const flashcard = await this.prisma.flashcard.findUnique({
            where: { id },
        });
        return flashcard ? this.toEntity(flashcard) : null;
    }

    private toEntity(flashcard: {
        id: string;
        question: string;
        answer: string;
        createdAt: Date;
        updatedAt: Date | null;
        categoryId: string;
    }): FlashcardEntity {
        return {
            id: flashcard.id,
            question: flashcard.question,
            answer: flashcard.answer,
            createdAt: flashcard.createdAt,
            updatedAt: flashcard.updatedAt ?? flashcard.createdAt,
        };
    }
}