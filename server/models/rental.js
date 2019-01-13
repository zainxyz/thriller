import Joi from 'joi';
import mongoose from 'mongoose';

/**
 * Define a stripped down version of the Customer model.
 * These fields are the absolute need for building the Rentals model.
 *
 * @type {mongoose}
 */
const strippedCustomerSchema = new mongoose.Schema({
    isGold: {
        default: false,
        type   : Boolean
    },
    name: {
        maxlength: 50,
        minlength: 5,
        required : true,
        type     : String
    },
    phone: {
        maxlength: 50,
        minlength: 5,
        required : true,
        type     : String
    }
});

/**
 * Define a stripped down version of the Movie model.
 * These fields are the absolute need for building the Rentals model.
 *
 * @type {mongoose}
 */
const strippedMovieSchema = new mongoose.Schema({
    title: {
        maxlength: 255,
        minlength: 5,
        required : true,
        trim     : true,
        type     : String
    },
    dailyRentalRate: {
        min     : 0,
        max     : 25,
        required: true,
        type    : Number
    }
});

/**
 * Define a schema for the Rental model.
 *
 * @type {mongoose}
 */
const schema = new mongoose.Schema({
    customer: {
        type    : strippedCustomerSchema,
        required: true
    },
    movie: {
        type    : strippedMovieSchema,
        required: true
    },
    dateOut: {
        type    : Date,
        required: true,
        default : Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min : 0
    }
});

/**
 * Build the Rental model.
 *
 * @type {mongoose}
 */
const Rental = mongoose.model('Rental', schema);

/**
 * Validate a given rental via the rental schema.
 *
 * @method validateRental
 * @param  {Object}       rental The rental to validate
 * @return {Object}                The validation object
 */
function validateRental(rental) {
    // Build the schema for the rental.
    const schema = {
        customerId: Joi.objectId().required(),
        movieId   : Joi.objectId().required()
    };
    // Validate the given rental and return the result.
    return Joi.validate(rental, schema);
}

// Export the Rental module.
export default Rental;
// Named exports
export { validateRental, schema as rentalSchema };
