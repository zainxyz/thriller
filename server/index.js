import express from 'express';
import winston from 'winston';

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
// Determine the port
const PORT = process.env.PORT || 3000;
// Build the routes for the app.
buildRoutes(app);
// Listen on the provided port.
const server = app.listen(PORT, () => {
    winston.info(`'thriller' server started on port ${PORT}...`);
});
// Export the server for testing purposes.
export default server;
