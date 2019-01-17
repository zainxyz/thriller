const jestConfig = {
    collectCoverage    : false,
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
    testMatch      : ['<rootDir>/**/tests/*.test.js']
};

module.exports = jestConfig;
