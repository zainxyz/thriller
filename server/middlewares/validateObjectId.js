import mongoose from 'mongoose';

/**
 * Is the current user an Admin?
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
            return res.status(404).json({
                success: false,
                message: `Invalid id of '${req.params.id}' was passed.`
            });
        }
        // If a valid ObjectId was passed, carry on...
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'This request requires higher privileges.'
        });
    }
}

export default validateObjectId;
