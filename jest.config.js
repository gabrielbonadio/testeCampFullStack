/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/tests/**/*.test.ts"],
  // 1) Mock do Prisma (precisa rodar antes dos imports dos testes)
  setupFiles: ["<rootDir>/src/tests/jest.prismaMock.ts", "<rootDir>/src/tests/setupEnv.ts"],
  // 2) Helpers/variáveis globais do Jest
  setupFilesAfterEnv: [],
  clearMocks: true,
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.jest.json" }],
  },
};

