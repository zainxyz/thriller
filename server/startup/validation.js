import Joi from 'joi';
import validateObjectId from 'joi-objectid';

/**
 * Add some validation to our API infastructure.
 *
 * @method validation
 */
function validation() {
    // Validate ObjectId from mongoDB
    Joi.objectId = validateObjectId(Joi);
}

export default validation;
