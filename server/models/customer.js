import Joi from 'joi';
import mongoose from 'mongoose';

/**
 * Define a schema for the Customer model.
 *
 * @type {mongoose}
 */
const schema = new mongoose.Schema({
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
 * Build the Customer model.
 *
 * @type {mongoose}
 */
const Customer = mongoose.model('Customer', schema);

/**
 * Validate a given customer via the customer schema.
 *
 * @method validateCustomer
 * @param  {Object}          customer The customer to validate
 * @return {Object}                   The validation object
 */
function validateCustomer(customer) {
    // Build the schema for the customer.
    const schema = {
        isGold: Joi.boolean().required(),
        name  : Joi.string()
            .min(5)
            .max(50)
            .required(),
        phone: Joi.string()
            .min(5)
            .max(50)
            .required()
    };
    // Validate the given customer and return the result.
    return Joi.validate(customer, schema);
}

// Export the Customer module.
export default Customer;
// Named exports
export { validateCustomer, schema as customerSchema };
