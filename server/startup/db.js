import mongoose from 'mongoose';
import winston from 'winston';

/**
 * Connect to the database.
 *
 * @method connectToDB
 */
function connectToDB() {
    // Connect to the mongoDB server
    mongoose
        .connect(
            'mongodb://localhost/thriller',
            {
                useCreateIndex : true,
                useNewUrlParser: true
            }
        )
        .then(() => {
            winston.info(`Connected to 'thriller' MongoDB...`);
        });
}

export default connectToDB;
