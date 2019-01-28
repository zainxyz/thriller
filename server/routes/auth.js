import Joi from 'joi';
import PasswordComplexity from 'joi-password-complexity';
import bcrypt from 'bcrypt';
import express from 'express';

import User from 'server/models/user';
import sendResponse from 'server/middlewares/send-response';
import throwError from 'server/middlewares/throw-error';
import validateModel from 'server/middlewares/validate-model';

// Create a Router
const router = express.Router();

/**
 * Validate a given auth request via the request schema.
 *
 * @method validateAuth
 * @param  {Object}      request The request to validate
 * @return {Object}              The validation object
 */
function validateAuth(request) {
    // Build the schema for the request.
    const schema = {
        email: Joi.string()
            .min(5)
            .max(255)
            .required()
            .email(),
        password: new PasswordComplexity({
            min             : 8,
            max             : 26,
            lowerCase       : 1,
            upperCase       : 1,
            numeric         : 1,
            symbol          : 0,
            requirementCount: 3
        }).required()
    };
    // Validate the given request and return the result.
    return Joi.validate(request, schema);
}

// Login and authenticate a user.
router.post('/', validateModel(validateAuth), async (req, res, next) => {
    try {
        // Validate that the user has not already been registered.
        const user = await User.findOne({ email: req.body.email });
        // If user exists, return 400 - Bad Request
        if (!user) {
            return throwError(`Invalid email or password.`, 400);
        }
        // Compare the hashsed password with the plaintext password.
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        // If invalid, return 400 - Bad Request
        if (!validPassword) {
            return throwError(`Invalid email or password`, 400);
        }
        // Generate a JWT token.
        const token = user.genAuthToken();
        // Valid login.
        return sendResponse(
            {
                accessToken: token
            },
            res
        );
    } catch (e) {
        next(e);
    }
});

export default router;
