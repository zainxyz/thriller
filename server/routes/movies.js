import express from 'express';

import Genre from 'server/models/genre';
import Movie, { validateMovie } from 'server/models/movie';
import adminMiddleware from 'server/middlewares/admin';
import authMiddleware from 'server/middlewares/auth';
import validateModel from 'server/middlewares/validateModel';

// Create a Router
const router = express.Router();

// Fetch the list of available movies.
router.get('/', async (req, res, next) => {
    try {
        // Fetch the list of movies
        const moviesList = await Movie.find().sort('name');
        // Send the list of movies
        res.send(moviesList);
    } catch (e) {
        next(e);
    }
});

// Fetch an individual movie via the movie id.
router.get('/:id', async (req, res, next) => {
    try {
        // Find the movie in the database
        const movie = await Movie.findById(req.params.id);
        // If movie is not found, send back an error.
        // 404 - Not Found
        if (!movie) {
            return res
                .status(404)
                .send(`The movie with given id of '${req.params.id}' was not found.`);
        }
        // Send back the found movie.
        res.send(movie);
    } catch (e) {
        next(e);
    }
});

// Create a new movie.
router.post('/', [authMiddleware, validateModel(validateMovie)], async (req, res, next) => {
    try {
        // Find the requested genre
        const genre = await Genre.findById(req.body.genreId);
        // If not found, send back an error.
        if (!genre) {
            return res.status(404).send(`Genre with id '${req.body.genreId}' was not found.`);
        }
        // Build the movie.
        const movie = new Movie({
            title: req.body.title,
            genre: {
                _id : genre._id,
                name: genre.name
            },
            numberInStock  : req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });
        // Save the newly created movie to the database.
        await movie.save();
        // Send back the newly created movie.
        res.send(movie);
    } catch (e) {
        next(e);
    }
});

// Update a given movie via the movie ID.
router.put('/:id', [authMiddleware, validateModel(validateMovie)], async (req, res, next) => {
    try {
        // Find the requested genre
        const genre = await Genre.findById(req.body.genreId);
        // If not found, send back an error.
        if (!genre) {
            return res.status(404).send(`Genre with id '${req.body.genreId}' was not found.`);
        }
        // Find the movie in the database
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                genre: {
                    _id : genre._id,
                    name: genre.name
                },
                numberInStock  : req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate
            },
            { new: true, upsert: true }
        );
        // If movie is not found, send back an error.
        // 404 - Not Found
        if (!movie) {
            return res
                .status(404)
                .send(`The movie with given id of '${req.params.id}' was not found.`);
        }
        // Return the updated movie
        res.send(movie);
    } catch (e) {
        next(e);
    }
});

// Delete a given movie via movie ID.
router.delete('/:id', [authMiddleware, adminMiddleware], async (req, res, next) => {
    try {
        // Find the movie in the database
        const movie = await Movie.findByIdAndRemove(req.params.id);
        // If movie is not found, send back an error.
        // 404 - Not Found
        if (!movie) {
            return res
                .status(404)
                .send(`The movie with given id of '${req.params.id}' was not found.`);
        }
        // Return the deleted movie
        res.send(movie);
    } catch (e) {
        next(e);
    }
});

export default router;
