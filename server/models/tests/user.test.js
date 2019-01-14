import jwt from 'jsonwebtoken';
import config from 'config';
import mongoose from 'mongoose';

import User from 'server/models/user';

describe('User (model)', () => {
    describe('genAuthToken()', () => {
        it('should return a valid jwt', () => {
            const payload = {
                _id    : new mongoose.Types.ObjectId().toHexString(),
                isAdmin: true
            };
            const user = new User(payload);
            const token = user.genAuthToken();
            const decodedToken = jwt.verify(token, config.get('jwtPrivateKey'));
            expect(decodedToken).toMatchObject(payload);
        });
    });
});
