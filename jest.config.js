const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  setupFiles: ["<rootDir>/jest.setup.ts"], // для .env.test
  setupFilesAfterEnv: ["<rootDir>/jest.setupAfterEnv.ts"], // для jest-dom и expect
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testMatch: ["**/tests/**/*.(test|spec).ts?(x)"],
};

module.exports = createJestConfig(customJestConfig);
