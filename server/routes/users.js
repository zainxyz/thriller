import _pick from 'lodash/pick';
import bcrypt from 'bcrypt';
import express from 'express';

import User, { validateUser } from 'server/models/user';
import authMiddleware from 'server/middlewares/auth';
import validateModel from 'server/middlewares/validate-model';

// Create a Router
const router = express.Router();

// Fetch the current user.
router.get('/current', authMiddleware, async (req, res, next) => {
    try {
        // Fetch the current user.
        const user = await User.findById(req.user._id).select('_id email name');
        // Send the user.
        res.json(user);
    } catch (e) {
        next(e);
    }
});

// Create a new user.
router.post('/', validateModel(validateUser), async (req, res, next) => {
    try {
        // Validate that the user has not already been registered.
        const registeredUser = await User.findOne({ email: req.body.email });
        // If user exists, return 400 - Bad Request
        if (registeredUser) {
            return res
                .status(400)
                .send(`A user has already been registered with these credentials.`);
        }
        // Build the user.
        const user = new User(_pick(req.body, ['name', 'email', 'password']));
        // Generate a salt.
        const salt = await bcrypt.genSalt(10);
        // Hash the user's password.
        user.password = await bcrypt.hash(user.password, salt);
        // Save the newly created user to the database.
        await user.save();
        // Generate a JWT token.
        const token = user.genAuthToken();
        // Send back the newly created user.
        res.header('Authorization', `Bearer ${token}`).send(_pick(user, ['_id', 'name', 'email']));
    } catch (e) {
        next(e);
    }
});

export default router;
