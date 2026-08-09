import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/e2e-firefox/**/*.spec.js"],
    testTimeout: 120000,
    hookTimeout: 120000,
    environment: "node",
    globals: false,
    fileParallelism: false,
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    reporters: process.env.CI ? ["default", "html"] : ["default"],
    outputFile: {
      html: "./test-results-firefox/index.html",
    },
  },
});
