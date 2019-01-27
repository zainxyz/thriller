import express from 'express';

import auth from 'server/routes/auth';
import customers from 'server/routes/customers';
import genres from 'server/routes/genres';
import movies from 'server/routes/movies';
import rentals from 'server/routes/rentals';
import returns from 'server/routes/returns';
import users from 'server/routes/users';

import errorHandler from 'server/middlewares/error';

/**
 * Build the routes for the application.
 *
 * @method buildRoutes
 * @param  {Object}    app The Express application
 */
function buildRoutes(app) {
    // Parse the JSON objects in body of the request
    app.use(express.json());

    // Define the routes
    app.use('/api/auth', auth);
    app.use('/api/customers', customers);
    app.use('/api/genres', genres);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/returns', returns);
    app.use('/api/users', users);

    // Add error handling.
    // NOTE: To handle error exceptions in express,
    // you add an error middleware as the last middleware
    // for the app to use.
    app.use(errorHandler);
}

export default buildRoutes;
