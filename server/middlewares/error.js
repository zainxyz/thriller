/* eslint-disable no-console, no-unused-vars */

import winston from 'winston';

/**
 * Error Middleware
 *
 * @method error
 * @param  {Error}    err  The Error / Exception
 * @param  {Object}   req  The API request
 * @param  {Object}   res  The API response
 * @param  {Function} next The next middleware
 */
function error(err, req, res, next) {
    // Log the Exception
    winston.error(err.message, err);
    // Send back a 500 response.
    res.status(err.status || 500).json({
        success: false,
        error  : {
            message: err.message || 'Something failed. Please try again.',
            stack  : err.stack
        }
    });
}

export default error;
