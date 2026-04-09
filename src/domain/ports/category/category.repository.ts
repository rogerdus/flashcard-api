import { CategoryEntity } from "../../entities/category/category.entity";

export interface CategoryRepository {
    create(name: string): Promise<CategoryEntity>;
    findAll(): Promise<CategoryEntity[]>;
    findById(id: string): Promise<CategoryEntity | null>;
    findByName(name: string): Promise<CategoryEntity | null>;
}