import express from 'express';

import Customer, { validateCustomer } from 'server/models/customer';
import adminMiddleware from 'server/middlewares/admin';
import authMiddleware from 'server/middlewares/auth';
import validateModel from 'server/middlewares/validate-model';

// Create a Router
const router = express.Router();

// Fetch the list of available customers.
router.get('/', async (req, res, next) => {
    try {
        // Fetch the list of customers
        const customersList = await Customer.find().sort('name');
        // Send the list of customers
        res.send(customersList);
    } catch (e) {
        next(e);
    }
});

// Fetch an individual customer via the customer id.
router.get('/:id', async (req, res, next) => {
    try {
        // Find the customer in the database
        const customer = await Customer.findById(req.params.id);
        // If customer is not found, send back an error.
        // 404 - Not Found
        if (!customer) {
            return res
                .status(404)
                .send(`The customer with given id of '${req.params.id}' was not found.`);
        }
        // Send back the found customer.
        res.send(customer);
    } catch (e) {
        next(e);
    }
});

// Create a new customer.
router.post('/', [authMiddleware, validateModel(validateCustomer)], async (req, res, next) => {
    try {
        // Build the customer.
        const customer = new Customer({
            isGold: req.body.isGold,
            name  : req.body.name,
            phone : req.body.phone
        });
        // Save the newly created customer to the database.
        await customer.save();
        // Send back the newly created customer.
        res.send(customer);
    } catch (e) {
        next(e);
    }
});

// Update a given customer via the customer ID.
router.put('/:id', [authMiddleware, validateModel(validateCustomer)], async (req, res, next) => {
    try {
        // Find the customer in the database
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            {
                isGold: req.body.isGold,
                name  : req.body.name,
                phone : req.body.phone
            },
            { new: true, upsert: true }
        );
        // If customer is not found, send back an error.
        // 404 - Not Found
        if (!customer) {
            return res
                .status(404)
                .send(`The customer with given id of '${req.params.id}' was not found.`);
        }
        // Return the updated customer
        res.send(customer);
    } catch (e) {
        next(e);
    }
});

// Delete a given customer via customer ID.
router.delete('/:id', [authMiddleware, adminMiddleware], async (req, res, next) => {
    try {
        // Find the customer in the database
        const customer = await Customer.findByIdAndRemove(req.params.id);
        // If customer is not found, send back an error.
        // 404 - Not Found
        if (!customer) {
            return res
                .status(404)
                .send(`The customer with given id of '${req.params.id}' was not found.`);
        }
        // Return the deleted customer
        res.send(customer);
    } catch (e) {
        next(e);
    }
});

export default router;
