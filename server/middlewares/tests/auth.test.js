import request from 'supertest';

import User from 'server/models/user';
import app from 'server/startup/app';

describe('auth (middleware)', () => {
    // Define an empty token
    let token;

    beforeEach(() => {
        token = new User().genAuthToken();
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
});
