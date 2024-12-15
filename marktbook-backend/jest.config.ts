import type {Config} from 'jest'

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    coverageDirectory: 'coverage',
    collectCoverage: true,
    testPathIgnorePatterns: ['/node_modules/'],
    transform: {
      '^.+\\.ts?$': 'ts-jest'
    },
    testMatch: ['<rootDir>/src/**/test/*.ts'],
    collectCoverageFrom: ['src/**/*.ts', '!src/**/test/*.ts?(x)', '!**/node_modules/**'],
    coverageThreshold: {
      global: {
        branches: 1,
        functions: 1,
        lines: 1,
        statements: 1
      }
    },
    coverageReporters: ['text-summary', 'lcov'],
moduleNameMapper: {
    '^@auth/(.*)$': '<rootDir>/src/features/auth/$1',
    '^@inventory/(.*)$': '<rootDir>/src/features/inventory/$1',
    '^@customers/(.*)$': '<rootDir>/src/features/customers/$1',
    '^@transactions/(.*)$': '<rootDir>/src/features/transactions/$1',
    '^@suppliers/(.*)$': '<rootDir>/src/features/suppliers/$1',
    '^@users/(.*)$': '<rootDir>/src/features/users/$1',
    '^@business/(.*)$': '<rootDir>/src/features/business/$1',
    '^@global/(.*)$': '<rootDir>/src/shared/globals/$1',
    '^@service/(.*)$': '<rootDir>/src/shared/services/$1',
    '^@socket/(.*)$': '<rootDir>/src/shared/sockets/$1',
    '^@worker/(.*)$': '<rootDir>/src/shared/workers/$1',
    '^@root/(.*)$': '<rootDir>/src/$1'
}
  }
  
  export default config