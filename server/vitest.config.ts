//eslint-ignore
import * as path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  esbuild: {
    target: "es2022",
  },
  test: {
    server: {
      deps: {
        inline: ["@fastify/autoload"]
      }
    },
    environment: "node",
    include: ["src/**/*.spec.ts", "test/**/*.spec.ts"],
    hookTimeout: 1000000000,
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
})
