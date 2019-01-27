import throwError from './throw-error';

/**
 * Validate a given model.
 *
 * @method validateModel
 * @param  {Function}      validator The model's validator function
 * @return {Function}
 */
function validateModel(validator) {
    return (req, res, next) => {
        try {
            // Validate
            const { error } = validator(req.body);
            // If invalid, return 400 - Bad Request
            if (error) {
                return throwError(error.details.map(e => e.message).join(', '), 400);
            }
            // If no error, carry on...
            next();
        } catch (error) {
            return throwError(
                error.message || "Please check the model's validator function.",
                error.status || 400
            );
        }
    };
}

export default validateModel;
