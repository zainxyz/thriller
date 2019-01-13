import Joi from 'joi';
import mongoose from 'mongoose';

import { genreSchema } from './genre';

/**
 * Define a schema for the Movie model.
 *
 * @type {mongoose}
 */
const schema = new mongoose.Schema({
    title: {
        maxlength: 255,
        minlength: 5,
        required : true,
        trim     : true,
        type     : String
    },
    genre: {
        type    : genreSchema,
        required: true
    },
    numberInStock: {
        min     : 0,
        max     : 100,
        required: true,
        type    : Number
    },
    dailyRentalRate: {
        min     : 0,
        max     : 25,
        required: true,
        type    : Number
    }
});

/**
 * Build the Movie model.
 *
 * @type {mongoose}
 */
const Movie = mongoose.model('Movie', schema);

/**
 * Validate a given movie via the movie schema.
 *
 * @method validateMovie
 * @param  {Object}       movie The movie to validate
 * @return {Object}                The validation object
 */
function validateMovie(movie) {
    // Build the schema for the movie.
    const schema = {
        title: Joi.string()
            .min(5)
            .max(255)
            .required(),
        genreId      : Joi.objectId().required(),
        numberInStock: Joi.number()
            .min(0)
            .max(100)
            .required(),
        dailyRentalRate: Joi.number()
            .min(0)
            .max(25)
            .required()
    };
    // Validate the given movie and return the result.
    return Joi.validate(movie, schema);
}

// Export the Movie module.
export default Movie;
// Named exports
export { validateMovie, schema as movieSchema };
