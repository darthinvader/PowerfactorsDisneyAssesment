import type { Config } from 'jest';
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})


// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
const config: Config = {
  preset: "ts-jest",
  testEnvironment: 'jsdom', // Use jsdom for DOM-related tests
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  transform: {
    '^.+\\.(ts|tsx|jsx)$': 'ts-jest', // Use ts-jest for TypeScript files
  },
  coverageProvider: "v8",
};

export default createJestConfig(config)
