'use strict';

const superTest = require('supertest');
const HTTP_CODE = require('http-status');

const {
    v4,
} = require('uuid');
const {
    expect,
} = require('chai');
const {
    DataSeeder,
} = require('../../test_helpers/DataSeeder');
const {
    app,
} = require('../../../src/app');

const superApp = superTest(app);

describe.only('Forgotten password', () => {

    const user_seed = {
        id: 300,
        first_name: 'Artiom',
        last_name: 'Fedorov',
        password: 'ShouldHaveLettersDigitsAndAtLeast8chars',
        email: `artiom.fedorov@${v4()}.com`,
    };


    beforeEach(async () => {
        await DataSeeder.truncateAll();
        await DataSeeder.createUserHashPassword(user_seed);
    });


    it('Should be able to request forgotten password mail', async () => {
        await superApp
            .post('/api/v1/users/forgotten-password')
            .send({
                email: user_seed.email,
            })
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {
                expect(response).to.have.property('body');
                expect(response.body).to.deep.equal({});
            });

        // @todo implement mock email

        // Implement call to update password

        // Implement connection test with new password

    });

});

