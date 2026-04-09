import { Router, Request, Response } from "express";

import { PrismaCategoryRepository } from "../../repositories/category.repository.js";
import { ListCategoriesUseCase } from "../../../app/categories/list-categories.use-case.js";
import { CreateCategoryUseCase } from "../../../app/categories/create-category.use-case.js";


const categoryRepository = new PrismaCategoryRepository();

export const categoryRoutes = Router();

// GET /categories
categoryRoutes.get("/", async (_req: Request, res: Response) => {
    try {
        const useCase = new ListCategoriesUseCase(categoryRepository);
        const categories = await useCase.execute();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// POST /categories
categoryRoutes.post("/", async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const useCase = new CreateCategoryUseCase(categoryRepository);
        const category = await useCase.execute(name);
        res.status(201).json(category);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        const status = message.includes("required") || message.includes("already exists") ? 400 : 500;
        res.status(status).json({ message });
    }
});