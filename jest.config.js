module.exports = {

    projects: [
        {
            preset: 'ts-jest',
            displayName: {
                name: ' Utils  ',
                color: 'orange',
            },
            testMatch: [
                '<rootDir>/src/utils/*.test.ts'
            ]
        },
        {
            preset: 'ts-jest',
            displayName: {
                name: 'Telegram',
                color: 'cyan',
            },
            testMatch: [
                '<rootDir>/src/telegram/**/*.test.ts'
            ]
        },
        {
            preset: 'ts-jest',
            displayName: {
                name: '   VK   ',
                color: 'blue',
            },
            testMatch: [
                '<rootDir>/src/vk/**/*.test.ts'
            ]
        }
    ]
};
