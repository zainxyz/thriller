import mongoose from 'mongoose';

import throwError from './throw-error';

/**
 * Are we passing in a valid `_id` field?
 *
 * @method validateObjectId
 * @param  {Object}         req The API request
 * @param  {Object}         res The API response
 * @param  {Function}       next The next middleware func
 * @return {Function}
 */
function validateObjectId(req, res, next) {
    try {
        // If an invalid ObjectId was passed, return an error.
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return throwError(`Invalid id of '${req.params.id}' was passed.`, 404);
        }
        // If a valid ObjectId was passed, carry on...
        next();
    } catch (error) {
        return throwError(
            error.message || 'This request requires higher privileges.',
            error.status || 400
        );
    }
}

export default validateObjectId;
