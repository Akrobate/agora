'use strict';

const superTest = require('supertest');
const HTTP_CODE = require('http-status');
const jwt = require('jsonwebtoken');
const {
    expect,
} = require('chai');
const crypto = require('crypto');

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

describe('UserLogin', () => {

    const user_repository = UserRepository.getInstance();

    const user_seed = {
        password: 'ShouldHaveLettersDigitsAndAtLeast8chars',
        email: 'artiom.fedorov@test.com',
    };

    before(async () => {
        await user_repository.sequelize_model.destroy({
            truncate: true,
            cascade: false,
        });

        const hashed_password = crypto
            .createHash('sha256')
            .update(`${configuration.security.salt}${user_seed.password}`)
            .digest('base64');

        await user_repository.create(Object.assign({}, user_seed, {
            password: hashed_password,
        }));

    });

    it('Should be able to login a user', async () => {
        await superApp
            .post('/api/v1/users/login')
            .send(user_seed)
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                expect(response.body).to.have.property('token');
                const decoded = jwt.verify(response.body.token, configuration.jwt.public_key);
                expect(decoded).to.be.an('Object');
                expect(decoded).to.have.property('exp');
                expect(decoded).to.have.property('iat');
            });
    });

    it('Should not be able to login with unexisting user', async () => {
        await superApp
            .post('/api/v1/users/login')
            .send(Object.assign({}, user_seed, {
                email: 'et.si.tu@nexistais.pas',
            }))
            .expect(HTTP_CODE.UNAUTHORIZED)
            .expect((response) => {
                expect(response.body).to.have.property('message', 'Bad login or password');
            });
    });

    it('Should not be able to login with bad user password', async () => {
        await superApp
            .post('/api/v1/users/login')
            .send(Object.assign({}, user_seed, {
                password: 'tu.tappes.pupuce.comme.une.pupuce',
            }))
            .expect(HTTP_CODE.UNAUTHORIZED)
            .expect((response) => {
                expect(response.body).to.have.property('message', 'Bad login or password');
            });
    });

});
