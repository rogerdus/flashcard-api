import { describe, it, expect, beforeEach } from "vitest";
import { PrismaCategoryRepository } from "./category.repository";
import { prisma } from "../adapters/prisma";

describe("PrismaCategoryRepository", () => {
    let repository: PrismaCategoryRepository;

    beforeEach(async () => {
        await prisma.flashcard.deleteMany();
        await prisma.category.deleteMany();
        repository = new PrismaCategoryRepository();
    });

    it("guarda y recupera una categoría", async () => {
        const { Category } = await import("../../domain/entities/category/category.entity");
        const category = Category.create({ id: crypto.randomUUID(),name: "JavaScript" });

        await repository.save(category);
        const found = await repository.findById(category.id);

        expect(found).not.toBeNull();
        expect(found!.name).toBe("JavaScript");
    });

    it("findByName retorna null si no existe", async () => {
        const result = await repository.findByName("NoExiste");
        expect(result).toBeNull();
    });

    it("findAll retorna todas las categorías", async () => {
        const { Category } = await import("../../domain/entities/category/category.entity");

        await repository.save(Category.create({ id: crypto.randomUUID(), name: "JavaScript" }));
        await repository.save(Category.create({ id: crypto.randomUUID(),name: "TypeScript" }));

        const all = await repository.findAll();
        expect(all).toHaveLength(2);
    });
});