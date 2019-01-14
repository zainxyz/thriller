import throwError from './throwError';

/**
 * Is the current user an Admin?
 *
 * @method admin
 * @param  {Object}   req The API request
 * @param  {Object}   res The API response
 * @param  {Function} next The next middleware func
 * @return {Function}
 */
function admin(req, res, next) {
    try {
        // If the user is not an admin, return Error
        if (!req.user.isAdmin) {
            return throwError('Access Denied', 403);
        }
        // If they are an admin, carry on...
        next();
    } catch (error) {
        return throwError(
            error.message || 'This request requires higher privileges.',
            error.status || 400
        );
    }
}

export default admin;
