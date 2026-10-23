/** @type {import('jest').Config} */
module.exports = {
  rootDir: '.',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/test/**/*.test.ts', '<rootDir>/test/**/*.test.tsx'],
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          module: 'commonjs',
          moduleResolution: 'node',
          target: 'ES2021',
          lib: ['DOM', 'ES2021'],
          esModuleInterop: true,
          strict: true,
          skipLibCheck: true,
        },
      },
    ],
  },
};
