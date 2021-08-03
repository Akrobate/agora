'use strict';

const superTest = require('supertest');
const HTTP_CODE = require('http-status');
const jwt = require('jsonwebtoken');
const {
    expect,
} = require('chai');

const {
    configuration,
} = require('../../src/configuration');

const {
    app,
} = require('../../src/app');

const {
    UserRepository,
} = require('../../src/repositories/UserRepository');

const superApp = superTest(app);

describe.only('UserLogin', () => {

    const user_repository = UserRepository.getInstance();

    before(async () => {
        await user_repository.sequelize_model.destroy({
            truncate: true,
            cascade: false,
        });
    });

    it('Should be able to login a user', async () => {

        const user_data = {
            password: 'ShouldHaveLettersDigitsAndAtLeast8chars',
            email: 'artiom.fedorov@test.com',
        };

        await superApp
            .post('/api/v1/users/login')
            .send(user_data)
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                expect(response.body).to.have.property('token');
                const decoded = jwt.verify(response.body.token, configuration.jwt.public_key);
                expect(decoded).to.be.an('Object');
                expect(decoded).to.have.property('exp');
                expect(decoded).to.have.property('iat');
            });
    });

});
