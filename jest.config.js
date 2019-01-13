const jestConfig = {
    collectCoverageFrom: ['<rootdir>/**/*.js'],
    testEnvironment    : 'node',
    testMatch          : ['<rootDir>/**/test/*.test.js'],
    verbose            : true
};

module.exports = jestConfig;
