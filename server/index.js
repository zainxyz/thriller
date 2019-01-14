import winston from 'winston';

import app from 'server/startup/app';

// Determine the port
const PORT = process.env.PORT || 3000;
// Listen on the provided port.
const server = app.listen(PORT, () => {
    // Extract port from server.
    const port = server.address().port;
    // Log info via winston.
    winston.info(`'thriller' server started on port ${port}...`);
});
