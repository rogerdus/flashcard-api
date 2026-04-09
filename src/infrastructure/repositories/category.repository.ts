import { PrismaClient } from "@prisma/client";
import { CategoryRepository } from "../../domain/ports/category/category.repository";
import { CategoryEntity } from "../../domain/entities/category/category.entity";

export class PrismaCategoryRepository implements CategoryRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(name: string): Promise<CategoryEntity> {
        const category = await this.prisma.category.create({
            data: { name },
        });
        return this.toEntity(category);
    }

    async findAll(): Promise<CategoryEntity[]> {
        const categories = await this.prisma.category.findMany({
            orderBy: { createdAt: "asc" },
        });
        return categories.map(this.toEntity);
    }

    async findById(id: string): Promise<CategoryEntity | null> {
        const category = await this.prisma.category.findUnique({
            where: { id },
        });
        return category ? this.toEntity(category) : null;
    }

    async findByName(name: string): Promise<CategoryEntity | null> {
        const category = await this.prisma.category.findUnique({
            where: { name },
        });
        return category ? this.toEntity(category) : null;
    }

    private toEntity(category: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
    }): CategoryEntity {
        return {
            id: category.id,
            name: category.name,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt ?? category.createdAt,
        };
    }
}