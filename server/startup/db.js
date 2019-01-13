import config from 'config';
import mongoose from 'mongoose';
import winston from 'winston';

/**
 * Connect to the database.
 *
 * @method connectToDB
 */
function connectToDB() {
    // Extract the db connection stream.
    const dbConnection = config.get('db');
    // Connect to the mongoDB server
    mongoose
        .connect(
            dbConnection,
            {
                useCreateIndex : true,
                useNewUrlParser: true
            }
        )
        .then(() => {
            winston.info(`Connected to 'thriller' @ ${dbConnection}...`);
        });
}

export default connectToDB;
