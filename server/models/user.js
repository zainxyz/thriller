import Joi from 'joi';
import PasswordComplexity from 'joi-password-complexity';
import config from 'config';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

/**
 * Define a schema for the User model.
 *
 * @type {mongoose}
 */
const schema = new mongoose.Schema({
    name: {
        type     : String,
        required : true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        maxlength: 255,
        minlength: 5,
        required : true,
        type     : String,
        unique   : true
    },
    password: {
        maxlength: 1024,
        minlength: 5,
        required : true,
        type     : String
    },
    isAdmin: {
        type: Boolean
    }
});

/**
 * Generate an oAuth Token for the current user.
 * NOTE: This is an instance method. It depends on the User object.
 *
 * @example
 * new User().genAuthToken()
 *
 * @method genAuthToken
 * @return {string}      The generated oAuth JWT
 */
schema.methods.genAuthToken = function() {
    // Generate a JWT token.
    const token = jwt.sign(
        {
            _id    : this._id,
            isAdmin: this.isAdmin
        },
        config.get('jwtPrivateKey')
    );
    // Return the token.
    return token;
};

/**
 * Build the User model.
 *
 * @type {mongoose}
 */
const User = mongoose.model('User', schema);

/**
 * Validate a given user via the user schema.
 *
 * @method validateUser
 * @param  {Object}       user The user to validate
 * @return {Object}                The validation object
 */
function validateUser(user) {
    // Build the schema for the user.
    const schema = {
        name: Joi.string()
            .min(5)
            .max(50)
            .required(),
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
    // Validate the given user and return the result.
    return Joi.validate(user, schema);
}

// Export the User module.
export default User;
// Named exports
export { validateUser, schema as userSchema };
