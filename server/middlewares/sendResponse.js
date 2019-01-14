/**
 * Sends a response back to the client.
 *
 * @method sendResponse
 * @param  {Object}     response  The response to send back
 * @param  {Stream}     resStream The express response stream
 */
function sendResponse(response, resStream) {
    // Generate the status code.
    const statusCode = resStream.req.method === 'POST' ? 201 : 200;
    // Send the response back to the client.
    resStream.status(statusCode).json({
        ...response
    });
}

export default sendResponse;
