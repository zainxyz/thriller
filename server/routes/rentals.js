import Fawn from 'fawn';
import express from 'express';
import mongoose from 'mongoose';

import Customer from 'server/models/customer';
import Movie from 'server/models/movie';
import Rental, { validateRental } from 'server/models/rental';
import authMiddleware from 'server/middlewares/auth';
import validateModel from 'server/middlewares/validateModel';

// Create a Router
const router = express.Router();
// Initialize Fawn
Fawn.init(mongoose);

// Fetch the list of available rentals.
router.get('/', async (req, res, next) => {
    try {
        // Fetch the list of rentals
        const rentalsList = await Rental.find().sort('-dateOut');
        // Send the list of rentals
        res.send(rentalsList);
    } catch (e) {
        next(e);
    }
});

// Create a new rental.
router.post('/', [authMiddleware, validateModel(validateRental)], async (req, res, next) => {
    try {
        // Find the requested customer
        const customer = await Customer.findById(req.body.customerId);
        // If not found, send back an error.
        if (!customer) {
            return res.status(404).send(`Customer with id '${req.body.customerId}' was not found.`);
        }
        // Find the requested movie
        const movie = await Movie.findById(req.body.movieId);
        // If not found, send back an error.
        if (!movie) {
            return res.status(404).send(`Movie with id '${req.body.movieId}' was not found.`);
        }
        // Check to see if the requested movie is available in stock.
        if (movie.numberInStock === 0) {
            return res.status(400).send(`The requested movie '${movie.title}' is out of stock.`);
        }
        // Build the rental.
        const rental = new Rental({
            customer: {
                _id  : customer._id,
                name : customer.name,
                phone: customer.phone
            },
            movie: {
                _id            : movie._id,
                title          : movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        });
        // Create a transaction
        new Fawn.Task()
            // Save the newly created rental to the database.
            .save('rentals', rental)
            // Decrement the stock for the rented movie.
            .update(
                'movies',
                { _id: movie._id },
                {
                    $inc: {
                        numberInStock: -1
                    }
                }
            )
            // Run Fawn
            .run();
        // Send back the newly created rental.
        res.send(rental);
    } catch (e) {
        next(e);
    }
});

export default router;
