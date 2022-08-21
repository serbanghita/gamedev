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
    moduleNameMapper: {
        "^file\-loader":"<rootDir>/src/__mocks__/fileMock.js",
    },
    transform: {
        "\\.ts$": "ts-jest",
    },
    testMatch: ["<rootDir>/src/**/*.test.ts"],
    verbose: true
};