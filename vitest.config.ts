import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    clearMocks: true,
    coverage: {
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      reporter: ["text", "lcov", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "coverage/",
        "vitest.config.ts",
        "test/",
        "src/**/*.test.ts",
        "src/**/*Test.ts",
        "src/types/**",
        "src/index.ts",
        "src/server.ts",
        "src/app.ts",
        "prisma/**",
        "src/providers/**",
        "src/lib/types.ts"
      ],
    },
  },
});
