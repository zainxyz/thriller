import express from 'express';

import buildRoutes from 'server/startup/routes';
import configureApp from 'server/startup/config';
import connectToDB from 'server/startup/db';
import logger from 'server/startup/logger';
import validation from 'server/startup/validation';

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
// Build the routes for the app.
buildRoutes(app);
// Export the app.
export default app;
