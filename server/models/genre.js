import Joi from 'joi';
import mongoose from 'mongoose';

/**
 * Define a schema for the Genre model.
 *
 * @type {mongoose}
 */
const schema = new mongoose.Schema({
    name: {
        maxlength: 50,
        minlength: 5,
        required : true,
        type     : String
    }
});

/**
 * Build the Genre model.
 *
 * @type {mongoose}
 */
const Genre = mongoose.model('Genre', schema);

/**
 * Validate a given genre via the genre schema.
 *
 * @method validateGenre
 * @param  {Object}       genre The genre to validate
 * @return {Object}             The validation object
 */
function validateGenre(genre) {
    // Build a schema for the genre.
    const schema = {
        name: Joi.string()
            .min(5)
            .max(50)
            .required()
    };
    // Validate the given genre and return the result.
    return Joi.validate(genre, schema);
}

// Export the Genre module.
export default Genre;
// Named exports
export { validateGenre, schema as genreSchema };
