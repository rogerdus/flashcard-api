import { describe, it, expect } from "vitest";
import { Question } from "./question.vo";

describe("Question", () => {
    it("crea una pregunta válida", () => {
        const q = new Question("¿Qué es DDD?");
        expect(q.value).toBe("¿Qué es DDD?");
    });

    it("limpia espacios", () => {
        const q = new Question("  ¿Qué es DDD?  ");
        expect(q.value).toBe("¿Qué es DDD?");
    });

    it("lanza error si está vacía", () => {
        expect(() => new Question("")).toThrow("Question is required");
    });

    it("lanza error si es menor a 5 caracteres", () => {
        expect(() => new Question("¿DDD")).toThrow("at least 5 characters");
    });
});