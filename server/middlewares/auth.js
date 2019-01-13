import config from 'config';
import jwt from 'jsonwebtoken';

/**
 * Authentication for a user.
 *
 * @method auth
 * @param  {Object}   req The API request
 * @param  {Object}   res The API response
 * @param  {Function} next The next middleware func
 * @return {Function}
 */
function auth(req, res, next) {
    try {
        // Extract the token from request header.
        let token = req.header('authorization');
        // If no token present, return error.
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. An oAuth token must be provided.'
            });
        }
        // Verify that token starts with `Bearer` text.
        if (!token.startsWith('Bearer ')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid oAuth token.'
            });
        }
        // Remove the `Bearer` from the string.
        token = token.slice(7, token.length);
        // Verify the token.
        const decodedToken = jwt.verify(token, config.get('jwtPrivateKey'));
        // Set the decoded token.
        req.user = decodedToken;
        // Pass on the middleware
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Invalid oAuth token.'
        });
    }
}

export default auth;
