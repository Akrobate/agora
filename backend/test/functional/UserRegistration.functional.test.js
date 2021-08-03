'use strict';

const superTest = require('supertest');

const {
    v4,
} = require('uuid');

const {
    expect,
} = require('chai');

const {
    app,
} = require('../../src/app');

const superApp = superTest(app);

describe.only('UserRegistration', () => {

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
            .expect(201)
            .expect((response) => {
                expect(response.body).to.have.property('password', user_data.password);
                expect(response.body).to.have.property('email', user_data.email);
                expect(response.body).to.have.property('first_name', user_data.first_name);
                expect(response.body).to.have.property('last_name', user_data.last_name);
            });
    });

});
