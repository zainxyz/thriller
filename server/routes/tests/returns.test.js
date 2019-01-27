import _addDays from 'date-fns/add_days';
import mongoose from 'mongoose';
import request from 'supertest';

import Movie from 'server/models/movie';
import Rental from 'server/models/rental';
import User from 'server/models/user';
import app from 'server/startup/app';

// POST /api/returns { customerId, movieId }
//
// Possible outcomes
//
// Return 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 404 if no rental found for this customer/movie
// Return 400 if rental already processed
//
// Return 201 if valid request
// Set the return date
// Calculate the rental fee
// Increase the stock of the movie
// Return the rental
//

describe('/api/returns (route)', () => {
    let customerId;
    let movie;
    let movieId;
    let rental;
    let token;

    // Execute the request
    async function executeRequest() {
        return await request(app)
            .post('/api/returns')
            .set('Authorization', token ? `Bearer ${token}` : '')
            .send({ customerId, movieId });
    }

    beforeEach(async () => {
        token = new User().genAuthToken();
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        // Create a new movie
        movie = new Movie({
            _id            : movieId,
            title          : '12345',
            dailyRentalRate: 2,
            genre          : { name: '12345' },
            numberInStock  : 10
        });
        // Save the movie
        await movie.save();
        // Create a new rental
        rental = new Rental({
            customer: {
                _id  : customerId,
                name : '12345',
                phone: '12345'
            },
            movie: {
                _id            : movieId,
                title          : '12345',
                dailyRentalRate: 2
            }
        });
        // Save the rental
        await rental.save();
    });

    afterEach(async () => {
        await Rental.remove({});
        await Movie.remove({});
    });

    it('should work', async () => {
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
    });

    describe('POST /api/returns', () => {
        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await executeRequest();

            expect(res.status).toBe(401);
        });

        it('should return 400 if customerId is not provided', async () => {
            customerId = '';

            const res = await executeRequest();

            expect(res.status).toBe(400);
        });

        it('should return 400 if movieId is not provided', async () => {
            movieId = '';

            const res = await executeRequest();

            expect(res.status).toBe(400);
        });

        it('should return 404 if no rental found for customer/movie', async () => {
            await Rental.remove({});

            const res = await executeRequest();

            expect(res.status).toBe(404);
        });

        it('should return 400 if return is alreay processed', async () => {
            rental.dateReturned = new Date();
            await rental.save();

            const res = await executeRequest();

            expect(res.status).toBe(400);
        });

        it('should return 201 if we have a valid request', async () => {
            const res = await executeRequest();

            expect(res.status).toBe(201);
        });

        it('should set the return date if input is valid', async () => {
            await executeRequest();

            const rentalInDB = await Rental.findById(rental._id);
            const dateDiff = new Date() - rentalInDB.dateReturned;

            expect(dateDiff).toBeLessThan(10 * 1000);
        });

        it('should set the rentalFee if input is valid', async () => {
            rental.dateOut = _addDays(new Date(), -7);
            await rental.save();

            await executeRequest();

            const rentalInDB = await Rental.findById(rental._id);

            expect(rentalInDB.rentalFee).toBeDefined();
        });

        it('should set increase the movie stock', async () => {
            await executeRequest();

            const movieInDB = await Movie.findById(movie._id);

            expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
        });

        it('should return the rental if input is valid', async () => {
            const res = await executeRequest();

            expect(Object.keys(res.body.rental)).toEqual(
                expect.arrayContaining([
                    'customer',
                    'dateOut',
                    'dateReturned',
                    'movie',
                    'rentalFee'
                ])
            );
        });
    });
});
