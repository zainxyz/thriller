import mongoose from 'mongoose';
import request from 'supertest';

import Genre from 'server/models/genre';
import User from 'server/models/user';
import app from 'server/startup/app';

import auth from 'server/middlewares/auth';

describe('auth (middleware)', () => {
    // Define an empty token
    let token;

    beforeEach(() => {
        token = new User().genAuthToken();
    });

    afterAll(() => {
        mongoose.disconnect();
    });

    // Execute the request
    function executeRequest() {
        return request(app)
            .post('/api/genres')
            .set('Authorization', token ? `Bearer ${token}` : '')
            .send({ name: 'genre1' });
    }

    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await executeRequest();

        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
        token = 'a';

        const res = await executeRequest();

        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async done => {
        const res = await executeRequest();

        expect(res.status).toBe(201);

        await Genre.remove({});
        done();
    });

    it('should populate req.user with the payload of a valid JWT', async done => {
        const user = {
            _id    : new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };

        const authToken = new User(user).genAuthToken();

        const req = {
            header: jest.fn().mockReturnValue(`Bearer ${authToken}`)
        };
        const res = {};
        const next = jest.fn();

        auth(req, res, next);

        expect(req.user).toBeDefined();
        expect(req.user).toMatchObject(user);

        await Genre.remove({});
        done();
    });
});
