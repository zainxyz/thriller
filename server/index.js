import express from 'express';
import winston from 'winston';

import buildRoutes from './startup/routes';
import configureApp from './startup/config';
import connectToDB from './startup/db';
import logger from './startup/logger';
import validation from './startup/validation';

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
// Determine the port
const PORT = process.env.PORT || 3000;
// Build the routes for the app.
buildRoutes(app);
// Listen on the provided port.
app.listen(PORT, () => {
    winston.info(`Server started on port ${PORT}...`);
});
