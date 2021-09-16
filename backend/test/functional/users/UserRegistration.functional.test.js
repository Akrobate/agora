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

describe('User registration tests', () => {

    const user_seed = {
        id: 300,
        first_name: 'Artiom',
        last_name: 'Fedorov',
        password: 'ShouldHaveLettersDigitsAndAtLeast8chars',
        email: `artiom.fedorov@${v4()}.com`,
    };

    before(async () => {
        await DataSeeder.truncate('UserRepository');
        await DataSeeder.createUserHashPassword(user_seed);
    });

    it('Should be able to register a user', async () => {
        const user_data = {
            first_name: 'Artiom',
            last_name: 'Fedorov',
            password: 'ShouldHaveLettersDigitsAndAtLeast8chars',
            email: `artiom.fedorov@${v4()}.com`,
        };
        await superApp
            .post('/api/v1/users/register')
            .send(user_data)
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {
                expect(response.body).to.have.property('id');
                expect(response.body).to.have.property('email', user_data.email);
                expect(response.body).to.have.property('first_name', user_data.first_name);
                expect(response.body).to.have.property('last_name', user_data.last_name);
            });
    });


    it('Should not be able to register an existing and registred user', async () => {
        await superApp
            .post('/api/v1/users/register')
            .send({
                first_name: user_seed.first_name,
                last_name: user_seed.last_name,
                password: user_seed.password,
                email: user_seed.email,
            })
            .expect(HTTP_CODE.BAD_REQUEST)
            .expect((response) => {
                expect(response.body).to.be.an('Object');
                expect(response.body).to.have.property('message', 'Email already exists');
            });
    });
});
