/**
 * Configure babel options.
 *
 * @method configureBabel
 * @see    {@link https://babeljs.io/docs/en/config-files#config-function-api}
 * @param  {Object}       [api={}] The babel api
 * @return {Object}                The babel config
 */
function configureBabel(api = {}) {
    // Turn off Cache.
    // @see {@link https://stackoverflow.com/a/51037631}
    // @see {@link https://babeljs.io/docs/en/config-files#apicache}
    api.cache && api.cache.never();
    // Return the plugins and presets from this func invocation.
    return {
        presets: [
            [
                // ES features necessary for user's Node version.
                require('@babel/preset-env').default,
                {
                    targets: {
                        browsers: ['last 3 versions'],
                        node    : 'current'
                    }
                }
            ]
        ]
    };
}

/**
 * Export out the `configureBabel` function as the default export.
 *
 * @type {Function}
 */
module.exports = configureBabel;
