import { Category } from "../../entities/category/category.entity";

export interface CategoryRepository {
    save(category: Category): Promise<Category>;
    findAll(): Promise<Category[]>;
    findById(id: string): Promise<Category | null>;
    findByName(name: string): Promise<Category | null>;
}