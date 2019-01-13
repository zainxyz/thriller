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
            return res.status(403).json({
                success: false,
                message: 'Access Denied.'
            });
        }
        // If they are an admin, carry on...
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'This request requires higher privileges.'
        });
    }
}

export default admin;
