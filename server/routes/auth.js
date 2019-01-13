import Joi from 'joi';
import PasswordComplexity from 'joi-password-complexity';
import bcrypt from 'bcrypt';
import express from 'express';

import User from '../models/user';

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

// Create a new user.
router.post('/', async (req, res, next) => {
    try {
        // Validate
        const { error } = validateAuth(req.body);
        // If invalid, return 400 - Bad Request
        if (error) {
            return res.status(400).send(error.details.map(e => e.message).join(', '));
        }
        // Validate that the user has not already been registered.
        const user = await User.findOne({ email: req.body.email });
        // If user exists, return 400 - Bad Request
        if (!user) {
            return res.status(400).send(`Invalid email or password.`);
        }
        // Compare the hashsed password with the plaintext password.
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        // If invalid, return 400 - Bad Request
        if (!validPassword) {
            return res.status(400).send(`Invalid email or password`);
        }
        // Generate a JWT token.
        const token = user.genAuthToken();
        // Valid login.
        res.send({
            accessToken: token
        });
    } catch (e) {
        next(e);
    }
});

export default router;
