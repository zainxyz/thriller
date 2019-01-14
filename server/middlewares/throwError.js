/**
 * Send an error back to the client.
 *
 * @method throwError
 * @param  {string}   text   The error text to send back
 * @param  {number}   status The error status code
 */
function throwError(text, status) {
    // Create a new Error.
    const err = new Error(text || 'An error occurred.');
    // Set the error status code.
    err.status = status || 500;
    // Throw the error.
    throw err;
}

export default throwError;
