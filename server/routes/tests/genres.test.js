import request from 'supertest';

import Genre from 'server/models/genre';
import User from 'server/models/user';
import app from 'server/startup/app';

describe('/api/genres (route)', () => {
    afterEach(async () => {
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([{ name: 'genre1' }, { name: 'genre2' }]);

            const res = await request(app).get('/api/genres');

            expect(res.status).toBe(200);
            expect(res.body.genres.length).toBe(2);
            expect(res.body.genres.some(genre => genre.name === 'genre1')).toBeTruthy();
            expect(res.body.genres.some(genre => genre.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(app).get(`/api/genres/${genre._id}`);

            expect(res.status).toBe(200);
            expect(res.body.genre).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(app).get(`/api/genres/1`);

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        // Define an empty token
        let token;
        // Define an empty genre name
        let name;

        // Execute the request
        async function executeRequest() {
            return await request(app)
                .post('/api/genres')
                .set('Authorization', token ? `Bearer ${token}` : '')
                .send({ name });
        }

        beforeEach(() => {
            token = new User().genAuthToken();
            name = 'genre1';
        });

        it('should return 401 if user is not logged in', async () => {
            token = '';

            const res = await executeRequest();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            name = '123';

            const res = await executeRequest();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');

            const res = await executeRequest();

            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            await executeRequest();

            const genre = await Genre.find({ name: 'genre1' });

            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async () => {
            const res = await executeRequest();

            expect(res.body.genre).toHaveProperty('_id');
            expect(res.body.genre).toHaveProperty('name', 'genre1');
        });
    });
});
