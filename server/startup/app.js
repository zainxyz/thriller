import express from 'express';

import buildRoutes from './routes';
import configureApp from './configure-app';
import connectToDB from './db';
import logger from './logger';
import prodEnv from './prod-env';
import validation from './validation';

// Log the error messages.
logger();
// Add some configuration for the app.
configureApp();
// Add some validation to our APIs.
validation();
// Connect to the database.
connectToDB();
// Create an express server
const app = express();
// Load in the production middlewares if we're in the prod environment.
if (process.env.NODE_ENV === 'production') {
    prodEnv(app);
}
// Build the routes for the app.
buildRoutes(app);
// Export the app.
export default app;
