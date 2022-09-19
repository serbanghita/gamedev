module.exports = {
    roots: ["<rootDir>/src"],
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverage: true,
    collectCoverageFrom: [
        "<rootDir>/src/**/*.ts",
        "!<rootDir>/src/**/*.d.ts",
        "!<rootDir>/src/**/*.test.ts",
        "!**/__mocks__/**",
        "!**/node_modules/**",
    ],
    coverageDirectory: ".tmp/coverage",
    coverageReporters: ["html", "json", "lcov", "text", "clover"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
    modulePaths: ['<rootDir>/src/'],
    moduleNameMapper: {
        "^file\-loader":"<rootDir>/src/__mocks__/fileMock.js",
        "@glhf/bitmask/bitmask": "<rootDir>/../glhf-bitmask/src/bitmask.ts",
    },
    transform: {
        "\\.ts$": "ts-jest",
    },
    testMatch: ["<rootDir>/src/**/*.test.ts"],
    verbose: true
};