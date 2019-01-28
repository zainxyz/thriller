/**
 * Sends a response back to the client.
 *
 * @method sendResponse
 * @param  {Object}     response   The response to send back
 * @param  {Stream}     resStream  The express response stream
 * @param  {number}     statusCode The response status code
 */
function sendResponse(response, resStream, statusCode = 200) {
    // Send the response back to the client.
    resStream.status(statusCode).json({
        ...response,
        success: true
    });
}

export default sendResponse;
