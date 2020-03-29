module.exports = {
    projects: [
        {
            preset: 'ts-jest',
            displayName: {
                name: ' Common ',
                color: 'yellow',
            },
            testMatch: [
                '<rootDir>/src/utils/*.test.ts',
            ],
        },
        {
            preset: 'ts-jest',
            displayName: {
                name: 'Telegram',
                color: 'cyan',
            },
            testMatch: [
                '<rootDir>/src/telegram/**/*.test.ts',
            ],
        },
        {
            preset: 'ts-jest',
            displayName: {
                name: '   VK   ',
                color: 'blue',
            },
            testEnvironment: 'node',
            testMatch: [
                '<rootDir>/src/vk/**/*.test.ts',
            ],
        }
    ]
};
