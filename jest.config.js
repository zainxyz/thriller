const jestConfig = {
    collectCoverageFrom: ['<rootDir>/**/server/**/*.js', '!<rootDir>/**/*.test.js'],
    coverageDirectory  : './coverage',
    coverageReporters  : ['html', 'text', 'text-summary'],
    coverageThreshold  : {
        global: {
            branches  : 80,
            functions : 80,
            lines     : 80,
            statements: 80
        }
    },
    testEnvironment: 'node',
    testMatch      : ['<rootDir>/**/tests/*.test.js']
};

module.exports = jestConfig;
