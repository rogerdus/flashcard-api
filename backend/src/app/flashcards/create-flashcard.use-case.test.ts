import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateFlashcardUseCase } from "./create-flashcard-use-case";
import { CategoryRepository } from "../../domain/ports/category/category.repository";
import { EventBus } from "../../domain/ports/event-bus.port";
import { Category } from "../../domain/entities/category/category.entity";
import { CategoryNotFoundError } from "../../domain/errors/category-not-found.error";


const mockCategoryRepository: CategoryRepository = {
    save: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    findByName: vi.fn(),
};

const mockEventBus: EventBus = {
    publish: vi.fn(),
};

describe("CreateFlashcardUseCase", () => {
    let useCase: CreateFlashcardUseCase;

    beforeEach(() => {
        vi.clearAllMocks();
        useCase = new CreateFlashcardUseCase(
            mockCategoryRepository,
            mockEventBus,
        );
    });

    it("crea una flashcard si la categoría existe", async () => {
        const category = Category.fromPrimitives({
            id: "cat-123",
            name: "JavaScript",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        vi.mocked(mockCategoryRepository.findById).mockResolvedValue(category);
        vi.mocked(mockCategoryRepository.save).mockImplementation(
            async (flashcard) => flashcard
        );

        const result = await useCase.execute({
            question: "¿Qué es DDD?",
            answer: "Domain Driven Design",
            categoryId: "cat-123",
        });

        expect(result.question).toBe("¿Qué es DDD?");
        expect(mockCategoryRepository.save).toHaveBeenCalledOnce();
        expect(mockEventBus.publish).toHaveBeenCalledOnce();
    });

    it("lanza CategoryNotFoundError si la categoría no existe", async () => {
        vi.mocked(mockCategoryRepository.findById).mockResolvedValue(null);

        await expect(useCase.execute({
            question: "¿Qué es DDD?",
            answer: "Domain Driven Design",
            categoryId: "cat-999",
        })).rejects.toThrow(CategoryNotFoundError);

        expect(mockCategoryRepository.save).not.toHaveBeenCalled();
    });
});