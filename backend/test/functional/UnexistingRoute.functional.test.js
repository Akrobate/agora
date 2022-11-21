'use strict';

const superTest = require('supertest');
const HTTP_CODE = require('http-status');

const {
    app,
} = require('../../src/app');

const {
    DataSeeder,
} = require('../test_helpers/DataSeeder');

const {
    manager_user_seed,
} = require('../test_seeds/test_data_seeds');


const superApp = superTest(app);

describe('MiddleWareTest', () => {
    it('unexisting route should return 404 code', async () => {
        await superApp
            .post('/api/v1/unexisting-route')
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.NOT_FOUND);
    });
});
