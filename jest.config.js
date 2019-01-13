const jestConfig = {
    collectCoverage    : true,
    collectCoverageFrom: ['<rootdir>/**/*.js'],
    coverageDirectory  : './coverage',
    coverageReporters  : ['json', 'html', 'text', 'text-summary'],
    coverageThreshold  : {
        global: {
            branches  : 80,
            functions : 80,
            lines     : 80,
            statements: 80
        }
    },
    testEnvironment: 'node',
    testMatch      : ['<rootDir>/**/tests/*.test.js'],
    verbose        : true
};

module.exports = jestConfig;
