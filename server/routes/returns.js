import express from 'express';
import _differenceInDays from 'date-fns/difference_in_days';

import Movie from 'server/models/movie';
import Rental, { validateRental } from 'server/models/rental';
import authMiddleware from 'server/middlewares/auth';
import sendResponse from 'server/middlewares/sendResponse';
import throwError from 'server/middlewares/throwError';
import validateModel from 'server/middlewares/validateModel';

// Create a Router
const router = express.Router();

// POST /api/returns { customerId, movieId }

// Possible outcomes
//
// Return 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 404 if no rental found for this customer/movie
// Return 400 if rental already processed
//
// Return 200 if valid request
// Set the return date
// Calculate the rental fee
// Increase the stock of the movie
// Return the rental

// Fetch the list of available rentals.
router.post('/', [authMiddleware, validateModel(validateRental)], async (req, res, next) => {
    try {
        // Fetch the rental from the db.
        const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
        // Catch errors for invalid rentals.
        if (!rental) {
            return throwError('rental not found', 404);
        }
        // Catch errors if a user is trying to return an already returned rental.
        if (rental.dateReturned) {
            return throwError('Your return has already been processed', 400);
        }
        // Calculate the rental fee.
        rental.calculateRentalFee();
        await rental.save();
        // Update the movie by incrementing the `numberInStock`.
        await Movie.update(
            { _id: rental.movie._id },
            {
                $inc: {
                    numberInStock: 1
                }
            }
        );
        // Send back the updated rental.
        sendResponse(
            {
                rental
            },
            res
        );
    } catch (e) {
        next(e);
    }
});

export default router;
