import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateCategoryUseCase } from "./create-category.use-case";
import { CategoryRepository } from '../../domain/ports/category/category.repository';
import { EventBus } from "../../domain/ports/event-bus.port";
import { Category } from "../../domain/entities/category/category.entity";
import { CategoryAlreadyExistsError } from "../../domain/errors/category-alredy-exist.error";

const mockCategoryRepository: CategoryRepository = {
    save: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    findByName: vi.fn(),
}

const mockEventBus: EventBus = {
    publish: vi.fn(),
}

describe("CreateCategoryUseCase", () => {
    let useCase: CreateCategoryUseCase;

    beforeEach(() => {
        vi.clearAllMocks();
        useCase = new CreateCategoryUseCase(mockCategoryRepository, mockEventBus);
    });

    it("create a category if doesnt exist", async() => {
        vi.mocked(mockCategoryRepository.findByName).mockResolvedValueOnce(null);
        vi.mocked(mockCategoryRepository.save).mockImplementation(
            async (category) => category
        )

        const result = await useCase.execute("javascript");

        expect(result.name).toBe("javascript");
        expect(mockCategoryRepository.save).toHaveBeenCalledOnce();
        expect(mockEventBus.publish).toHaveBeenCalledOnce();
    });

    it("launch CategoryAlreadyExistsError if category already exist", async() => {
        const exist = Category.fromPrimitives({
            id: crypto.randomUUID(),
            name: "javascript",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        vi.mocked(mockCategoryRepository.findByName).mockResolvedValueOnce(exist);

        await expect(useCase.execute("javascript"))
            .rejects
            .toThrow(CategoryAlreadyExistsError);

        expect(mockCategoryRepository.save).not.toHaveBeenCalled();
        expect(mockEventBus.publish).not.toHaveBeenCalled();
    })
})