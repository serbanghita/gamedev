import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import * as path from "node:path";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        alias: {
            '@glhf/bitmask/': path.join(__dirname,  '../glhf-bitmask/src/')
        }
    }
})