import { describe, it, expect } from "vitest";
import { Category } from "./category.entity";

describe("Category", () => {
    describe("create", () => {
        it("should create a new category", () => {
            const category = Category.create({ id: "1", name:  "Javascript" });

            expect(category.id).toBeDefined();
            expect(category.name).toBe("Javascript");
            expect(category.createdAt).toBeInstanceOf(Date);
        })

        it("Clean spaces in name", () => {
            const category = Category.create({ id: "1", name:  "  Javascript  " });

            expect(category.name).toBe("Javascript");
        });

        it("accumulate events CategoryCreated",() => {
            const category = Category.create({ id: "1", name:  "Javascript" });
            const events = category.pullEvents();

            expect(events).toHaveLength(1);
            expect(events[0].eventName).toBe("category.created")
        });

        it("pullEvents cleans the list of events", () => {
            const category = Category.create({ id: "1",name: "Javascript"});
            category.pullEvents();
            expect(category.pullEvents()).toHaveLength(0);
        })
    });

    describe("fromPrimitives", () => {
        it("rebuild a category without events", () => {
            const now = new Date();
            const category = Category.fromPrimitives({
                id: "1",
                name: "Javascript",
                createdAt: now,
                updatedAt: now,
            });

            expect(category.id).toBe("1");
            expect(category.name).toBe("Javascript");
            expect(category.pullEvents()).toHaveLength(0);
        });
    });
})