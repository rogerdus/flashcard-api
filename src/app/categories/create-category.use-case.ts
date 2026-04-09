import { CategoryEntity } from "../../domain/entities/category/category.entity";
import { CategoryRepository } from "../../domain/ports/category/category.repository";

export class CreateCategoryUseCase {
    constructor(private readonly categoryRepository: CategoryRepository) {}

    async execute(name: string): Promise<CategoryEntity> {
        if (!name || name.trim().length === 0) {
            throw new Error("Category name is required");
        }

        const exist = await this.categoryRepository.findByName(name.trim());
        if (exist) {
            throw new Error("Category already exists");
        }

        return this.categoryRepository.create(name.trim());
    }
}