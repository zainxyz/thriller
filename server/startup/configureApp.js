import config from 'config';

/**
 * Some configuration settings for the application.
 *
 * @method configureApp
 */
function configureApp() {
    // Exit the current Node.js process if the `jwtPrivateKey` env variable is not defined.
    if (!config.get('jwtPrivateKey')) {
        // Throw an error, that way we can catch it via our error middleware and log it.
        throw new Error(`FATAL ERROR: 'jwtPrivateKey' is not defined.`);
    }
}

export default configureApp;
