import express from 'express';

import Genre, { validateGenre } from '../models/genre';
import adminMiddleware from '../middlewares/admin';
import authMiddleware from '../middlewares/auth';

// Create a Router
const router = express.Router();

// Fetch the list of available genres.
router.get('/', async (req, res, next) => {
    try {
        // Fetch the list of genres
        const genresList = await Genre.find().sort('name');
        // Send the list of genres
        res.send(genresList);
    } catch (e) {
        next(e);
    }
});

// Fetch an individual genre via the genre id.
router.get('/:id', async (req, res, next) => {
    try {
        // Find the genre in the database
        const genre = await Genre.findById(req.params.id);
        // If genre is not found, send back an error.
        // 404 - Not Found
        if (!genre) {
            return res
                .status(404)
                .send(`The genre with given id of '${req.params.id}' was not found.`);
        }
        // Send back the found genre.
        res.send(genre);
    } catch (e) {
        next(e);
    }
});

// Create a new genre.
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        // Validate
        const { error } = validateGenre(req.body);
        // If invalid, return 400 - Bad Request
        if (error) {
            return res.status(400).send(error.details.map(e => e.message).join(', '));
        }
        // Build the genre.
        const genre = new Genre({
            name: req.body.name
        });
        // Save the newly created genre to the database.
        await genre.save();
        // Send back the newly created genre.
        res.send(genre);
    } catch (e) {
        next(e);
    }
});

// Update a given genre via the genre ID.
router.put('/:id', authMiddleware, async (req, res, next) => {
    try {
        // Validate
        const { error } = validateGenre(req.body);
        // If invalid, return 400 - Bad Request
        if (error) {
            return res.status(400).send(error.details.map(e => e.message).join(', '));
        }
        // Find the genre in the database
        const genre = await Genre.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true, upsert: true }
        );
        // If genre is not found, send back an error.
        // 404 - Not Found
        if (!genre) {
            return res
                .status(404)
                .send(`The genre with given id of '${req.params.id}' was not found.`);
        }
        // Return the updated genre
        res.send(genre);
    } catch (e) {
        next(e);
    }
});

// Delete a given genre via genre ID.
router.delete('/:id', [authMiddleware, adminMiddleware], async (req, res, next) => {
    try {
        // Find the genre in the database
        const genre = await Genre.findByIdAndRemove(req.params.id);
        // If genre is not found, send back an error.
        // 404 - Not Found
        if (!genre) {
            return res
                .status(404)
                .send(`The genre with given id of '${req.params.id}' was not found.`);
        }
        // Return the deleted genre
        res.send(genre);
    } catch (e) {
        next(e);
    }
});

export default router;
