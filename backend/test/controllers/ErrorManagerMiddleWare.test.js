'use strict';

const superTest = require('supertest');
const HTTP_CODE = require('http-status');

const {
    mock,
} = require('sinon');

const {
    app,
} = require('../../src/app');

const {
    CustomError,
} = require('../../src/CustomError');

const {
    UserService,
} = require('../../src/services');

const superApp = superTest(app);

describe('ErrorManagerMiddleWare', () => {

    const mocks = {};

    beforeEach(() => {
        mocks.service_user = mock(UserService.getInstance());
    });

    afterEach(() => {
        mocks.service_user.restore();
    });

    const user_seed = {
        password: 'JustAPasswordToPassJoiVerification',
        email: 'artiom.fedorov@test.com',
    };

    it('Not a custom error should return a 500 code', async () => {

        mocks.service_user
            .expects('login')
            .rejects(new Error('coucou'));

        await superApp
            .post('/api/v1/users/login')
            .send(user_seed)
            .expect(HTTP_CODE.INTERNAL_SERVER_ERROR);
    });

    it('Unknown code should return a 500 code', async () => {

        mocks.service_user
            .expects('login')
            .rejects(new CustomError(10002));

        await superApp
            .post('/api/v1/users/login')
            .send(user_seed)
            .expect(HTTP_CODE.INTERNAL_SERVER_ERROR);
    });

    it('known Error BAD_REQUEST should return a 400 code', async () => {

        mocks.service_user
            .expects('login')
            .rejects(new CustomError(CustomError.BAD_PARAMETER));

        await superApp
            .post('/api/v1/users/login')
            .send(user_seed)
            .expect(HTTP_CODE.BAD_REQUEST);
    });

});
