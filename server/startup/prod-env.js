import helmet from 'helmet';
import compression from 'compression';

/**
 * Configure the production environment for the application.
 * Install the necessary middlewares.
 *
 * @method prodEnv
 * @param  {Object} app THe Express application
 */
function prodEnv(app) {
    // Fix HTTP headers.
    app.use(helmet());
    // Compress the HTTP response sent back to the client.
    app.use(compression());
}

export default prodEnv;
