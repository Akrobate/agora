'use strict';

const superTest = require('supertest');
const HTTP_CODE = require('http-status');
const {
    expect,
} = require('chai');
const {
    app,
} = require('../../../src/app');
const {
    DataSeeder,
} = require('../../test_helpers/DataSeeder');

const superApp = superTest(app);

describe('UserLogin', () => {

    const user_seed = {
        password: 'ShouldHaveLettersDigitsAndAtLeast8chars',
        email: 'artiom.fedorov@test.com',
    };

    before(async () => {
        await DataSeeder.truncate('UserRepository');
        await DataSeeder.createUserHashPassword(user_seed);
    });


    it('Should be able to login a user', async () => {
        await superApp
            .post('/api/v1/users/login')
            .send(user_seed)
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                expect(response.body).to.have.property('token');
                const decoded = DataSeeder.decodeJwt(response.body.token);
                expect(decoded).to.be.an('Object');
                expect(decoded).to.have.property('exp');
                expect(decoded).to.have.property('iat');
            });
    });

    it('Should not be able to login with unexisting user', async () => {
        await superApp
            .post('/api/v1/users/login')
            .send({
                ...user_seed,
                email: 'et.si.tu@nexistais.pas',
            })
            .expect(HTTP_CODE.UNAUTHORIZED)
            .expect((response) => {
                expect(response.body).to.have.property('message', 'Bad login or password');
            });
    });

    it('Should not be able to login with bad user password', async () => {
        await superApp
            .post('/api/v1/users/login')
            .send({
                ...user_seed,
                password: 'tu.tappes.pupuce.comme.une.pupuce',
            })
            .expect(HTTP_CODE.UNAUTHORIZED)
            .expect((response) => {
                expect(response.body).to.have.property('message', 'Bad login or password');
            });
    });

});
