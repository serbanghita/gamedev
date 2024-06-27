import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import * as path from "node:path";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        alias: {
            '@serbanghita-gamedev/assets/': path.join(__dirname,  '../assets/'),
            '@serbanghita-gamedev/bitmask/': path.join(__dirname,  '../bitmask/'),
            '@serbanghita-gamedev/component/': path.join(__dirname,  '../component/'),
            '@serbanghita-gamedev/ecs/': path.join(__dirname,  '../ecs/'),
            '@serbanghita-gamedev/input/': path.join(__dirname,  '../input/'),
            '@serbanghita-gamedev/renderer/': path.join(__dirname,  '../renderer/'),
            '@serbanghita-gamedev/matrix/': path.join(__dirname,  '../matrix/')
        }
    }
})