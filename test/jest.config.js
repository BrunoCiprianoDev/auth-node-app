const { resolve } = require('path');
const root = resolve(__dirname, '..');
const rootConfig = require(`${root}/jest.config.js`);

module.exports = {...rootConfig, ...{
    rootDir: root,
    displayName: "end2end-tests",
    setupFilesAfterEnv: ["<rootDir>/test/jest-starter.ts"],
    testMatch: ["<rootDir>/test/**/*.test.ts"],
    collectCoverage: false,
    globalSetup: '<rootDir>/test/config/jest.global.setup.ts',
    globalTeardown: '<rootDir>/test/config/jest.global.teardown.ts',
}}