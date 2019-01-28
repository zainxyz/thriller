import 'winston-mongodb';
import { configure, format, transports } from 'winston';

const { combine, label, prettyPrint, printf, splat, timestamp } = format;

// Define a custom format for logging to the console.
const myConsoleFormat = printf(info => {
    return `[${info.label}] ${info.level}: ${info.message}`;
});

/**
 * Log error messages in the application.
 *
 * @method logger
 */
function logger() {
    /**
     * Configure the 'winston' module.
     *
     * @type {Object}
     */
    configure({
        level     : 'error',
        format    : combine(label({ label: 'thriller' }), timestamp(), splat(), prettyPrint()),
        transports: [
            new transports.Console({
                level : 'info',
                format: myConsoleFormat
            }),
            new transports.File({
                filename: 'errors.log'
            }),
            // NOTE: commenting out to run integration tests.
            new transports.MongoDB({
                db     : 'mongodb://localhost/thriller',
                options: {
                    useNewUrlParser: true
                }
            })
        ],
        exceptionHandlers: [
            new transports.Console({
                format: myConsoleFormat
            }),
            new transports.File({
                filename: 'uncaughtExceptions.log'
            })
        ],
        exitOnError: false
    });

    /**
     * Catch uncaught exceptions in the Node.js process.
     * NOTE: This only works with Synchronous code.
     *
     * @type {Event}
     */
    // process.on('uncaughtException', exception => {
    //     // Log the Exception.
    //     winston.error(exception.message, exception);
    //     // Exit the Node.js process.
    //     process.exit(1);
    // });

    /**
     * Catch unhandled rejections in the Node.js process.
     * NOTE: this only works with Async code.
     *
     * @type {Event}
     */
    process.on('unhandledRejection', exception => {
        // Throw the exception so that we can catch it via 'winston'.
        throw exception;
        // // Log the Exception.
        // winston.error(exception.message, exception);
        // // Exit the Node.js process.
        // process.exit(1);
    });
}

export default logger;
