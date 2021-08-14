'use strict';

const superTest = require('supertest');
const HTTP_CODE = require('http-status');

const {
    expect,
} = require('chai');

const {
    app,
} = require('../../src/app');

const {
    DataSeeder,
} = require('../helpers/DataSeeder');

const superApp = superTest(app);

describe('UserTokenRenew', () => {

    const manager_user_seed = {
        id: 100,
        password: 'ShouldHaveLettersDigitsAndAtLeast8chars1',
        email: 'manager.user@test.com',
    };


    before(async () => {
        await DataSeeder.truncate('UserRepository');
        await DataSeeder.createUserHashPassword(manager_user_seed);
    });


    it('Manager should be able to login and one second later renew token', async () => {
        await superApp
            .post('/api/v1/users/login')
            .send({
                email: manager_user_seed.email,
                password: manager_user_seed.password,
            })
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                expect(response.body).to.have.property('token');
                const decoded = DataSeeder.decodeJwt(response.body.token);
                expect(decoded).to.be.an('Object');
                expect(decoded).to.have.property('exp');
                expect(decoded).to.have.property('iat');
                expect(decoded).to.have.property('email', manager_user_seed.email);
            });

        await superApp
            .post('/api/v1/users/token/renew')
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                const decoded = DataSeeder.decodeJwt(response.body.token);
                expect(decoded).to.be.an('Object');
                expect(decoded).to.have.property('exp');
                expect(decoded).to.have.property('iat');
                expect(decoded).to.have.property('email', manager_user_seed.email);
            });
    });


});
