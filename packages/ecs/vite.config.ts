import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import * as path from "node:path";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        alias: {
            '@serbanghita-gamedev/bitmask/': path.join(__dirname,  '../bitmask/'),
            '@serbanghita-gamedev/component/': path.join(__dirname,  '../component/')
        }
    }
})