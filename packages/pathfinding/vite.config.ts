import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    alias: {
      "@serbanghita-gamedev/renderer/": path.join(__dirname, "../renderer/"),
      "@serbanghita-gamedev/geometry/": path.join(__dirname, "../geometry/"),
    },
    coverage: {
      provider: "istanbul", // or 'v8'
      // exclude: ["./src/demo.ts", "./src/demo2.ts"],
    },
  },
});
