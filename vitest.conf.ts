import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        hookTimeout: 30000,
        testTimeout: 30000,
        include: ["src/**/*.test.ts", "src/**/*.integration.test.ts"],
        exclude: ["dist/**"],  // ✅ ignora el dist completamente
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
            include: ["src/**/*.ts"],
            exclude: [
                "src/index.ts",
                "src/infrastructure/database/**",
                "**/*.test.ts",
                "**/*.integration.test.ts",
            ],
        },
    },
});