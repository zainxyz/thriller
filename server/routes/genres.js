import express from 'express';

import Genre, { validateGenre } from 'server/models/genre';
import adminMiddleware from 'server/middlewares/admin';
import authMiddleware from 'server/middlewares/auth';
import sendResponse from 'server/middlewares/send-response';
import throwError from 'server/middlewares/throw-error';
import validateModel from 'server/middlewares/validate-model';
import validateObjectIdMiddleware from 'server/middlewares/validate-object-id';

// Create a Router
const router = express.Router();

// Fetch the list of available genres.
router.get('/', async (req, res, next) => {
    try {
        // Fetch the list of genres
        const genresList = await Genre.find().sort('name');
        // Send the list of genres
        return sendResponse(
            {
                totalRecords: genresList.length,
                genres      : genresList
            },
            res
        );
    } catch (e) {
        next(e);
    }
});

// Fetch an individual genre via the genre id.
router.get('/:id', validateObjectIdMiddleware, async (req, res, next) => {
    try {
        // Find the genre in the database
        const genre = await Genre.findById(req.params.id);
        // If genre is not found, send back an error.
        // 404 - Not Found
        if (!genre) {
            return throwError(`The genre with given id of '${req.params.id}' was not found.`, 404);
        }
        // Send back the found genre.
        return sendResponse(
            {
                genre
            },
            res
        );
    } catch (e) {
        next(e);
    }
});

// Create a new genre.
router.post('/', [authMiddleware, validateModel(validateGenre)], async (req, res, next) => {
    try {
        // Build the genre.
        const genre = new Genre({
            name: req.body.name
        });
        // Save the newly created genre to the database.
        await genre.save();
        // Send back the newly created genre.
        return sendResponse(
            {
                genre
            },
            res,
            201
        );
    } catch (e) {
        next(e);
    }
});

// Update a given genre via the genre ID.
router.put('/:id', [authMiddleware, validateModel(validateGenre)], async (req, res, next) => {
    try {
        // Find the genre in the database
        const genre = await Genre.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true, upsert: true }
        );
        // If genre is not found, send back an error.
        // 404 - Not Found
        if (!genre) {
            return throwError(`The genre with given id of '${req.params.id}' was not found.`, 404);
        }
        // Return the updated genre
        return sendResponse(
            {
                genre
            },
            res
        );
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
            return throwError(`The genre with given id of '${req.params.id}' was not found.`, 404);
        }
        // Return the deleted genre
        return sendResponse(
            {
                genre
            },
            res
        );
    } catch (e) {
        next(e);
    }
});

export default router;
