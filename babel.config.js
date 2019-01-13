const path = require('path');

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
    // Extract some environment variables.
    const NODE_ENV = process.env.NODE_ENV || 'development';
    // Determine the current environment.
    const isEnvDevelopment = NODE_ENV === 'development';
    const isEnvProduction = NODE_ENV === 'production';
    const isEnvTest = NODE_ENV === 'test';
    // Define the plugins for babel.
    const plugins = [
        // Necessary to include regardless of the environment because
        // in practice some other transforms (such as object-rest-spread)
        // don't work without it: https://github.com/babel/babel/issues/7215
        require('@babel/plugin-transform-destructuring').default,
        // Turn on legacy decorators.
        [
            require('@babel/plugin-proposal-decorators').default,
            {
                decoratorsBeforeExport: true
            }
        ],
        // class { handleClick = () => { } }
        // Enable loose mode to use assignment instead of defineProperty
        // See discussion in https://github.com/facebook/create-react-app/issues/4263
        [
            require('@babel/plugin-proposal-class-properties').default,
            {
                loose: true
            }
        ],
        // The following two plugins use Object.assign directly, instead of Babel's
        // extends helper. Note that this assumes `Object.assign` is available.
        // { ...todo, completed: true }
        [
            require('@babel/plugin-proposal-object-rest-spread').default,
            {
                useBuiltIns: true
            }
        ],
        // Polyfills the runtime needed for async/await, generators, and friends
        // https://babeljs.io/docs/en/babel-plugin-transform-runtime
        [
            require('@babel/plugin-transform-runtime').default,
            {
                corejs         : false,
                helpers        : true,
                regenerator    : true,
                // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
                // We should turn this on once the lowest version of Node LTS
                // supports ES Modules.
                useESModules   : false,
                // useESModules   : isEnvDevelopment || isEnvProduction,
                // Undocumented option that lets us encapsulate our runtime, ensuring
                // the correct version is used
                // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
                absoluteRuntime: path.dirname(require.resolve('@babel/runtime/package.json'))
            }
        ],
        // Adds syntax support for import()
        require('@babel/plugin-syntax-dynamic-import').default,
        // Transform dynamic import to require.
        isEnvTest && require('babel-plugin-dynamic-import-node'),
        [
            // Custom module resolver for babel,
            // provides cleaner import statements.
            // Instead of:
            //      import AppNav from '../../../components/AppNav';
            // we can now write:
            //      import AppNav from 'components/AppNav'
            require('babel-plugin-module-resolver').default,
            {
                // Set the root directory to `src`,
                // this way all immediate sub-directories can be used in import statements directly.
                root : ['./'],
                alias: {
                    server: './server',
                    client: './client'
                }
            }
        ]
    ].filter(Boolean);
    // Define the presets for babel.
    const presets = [
        isEnvTest && [
            // ES features necessary for user's Node version.
            require('@babel/preset-env').default,
            {
                targets: {
                    node: 'current'
                }
            }
        ],
        (isEnvProduction || isEnvDevelopment) && [
            // Latest stable ECMAScript features.
            require('@babel/preset-env').default,
            {
                // Let's be compatible with IE 9 until React itself no longer works with IE 9.
                targets: {
                    ie: 9
                },
                // We're tuning this Babel config for ES5 support.
                ignoreBrowserslistConfig: true,
                // If devs import all core-js they're probably not concerned with
                // bundle size. We shouldn't rely on magic to try and shrink it.
                useBuiltIns             : false,
                // Do not transform modules to CJS.
                modules                 : false,
                // Exclude transforms that make all code slower.
                exclude                 : ['transform-typeof-symbol']
            }
        ]
    ].filter(Boolean);
    // Return the plugins and presets from this func invocation.
    return {
        plugins,
        presets
    };
}

/**
 * Export out the `configureBabel` function as the default export.
 *
 * @type {Function}
 */
module.exports = configureBabel;
