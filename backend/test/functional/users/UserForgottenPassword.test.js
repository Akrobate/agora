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
    mock,
} = require('sinon');
const {
    DataSeeder,
} = require('../../test_helpers/DataSeeder');
const {
    EmailService,
    UserService,
} = require('../../../src/services');
const {
    UserRepository,
} = require('../../../src/repositories');
const {
    app,
} = require('../../../src/app');

const superApp = superTest(app);

const user_repository = UserRepository.getInstance();
const user_service = UserService.getInstance();
const email_service = EmailService.getInstance();

describe('Forgotten password', () => {

    const mocks = {};

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

        mocks.service_email = mock(email_service);
    });


    afterEach(() => {
        mocks.service_email.restore();
    });


    it('Should be able to request forgotten password mail', async () => {

        const new_password = 'New_Password_Forgotten321';

        mocks.service_email
            .expects('sendMail')
            .resolves({});

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


        const stored_user = await user_repository.find({
            id: user_seed.id,
        });

        const forgotten_password_token = user_service.generateForgottenPasswordToken(stored_user);

        await superApp
            .patch(`/api/v1/users/${user_seed.id}/forgotten-password`)
            .send({
                forgotten_password_token,
                new_password,
            })
            .expect(HTTP_CODE.CREATED);

        await superApp
            .post('/api/v1/users/login')
            .send({
                email: user_seed.email,
                password: new_password,
            })
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                expect(response.body).to.have.property('token');
                const decoded = DataSeeder.decodeJwt(response.body.token);
                expect(decoded).to.be.an('Object');
                expect(decoded).to.have.property('exp');
                expect(decoded).to.have.property('iat');
            });

        mocks.service_email.verify();

    });


    it('Should not be able to request forgotten password mail when wrong generated_forgotten_password_token', async () => {

        const new_password = 'New_Password_Forgotten321';

        mocks.service_email
            .expects('sendMail')
            .resolves({});

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

        const forgotten_password_token = 'bad_token_string'

        await superApp
            .patch(`/api/v1/users/${user_seed.id}/forgotten-password`)
            .send({
                forgotten_password_token,
                new_password,
            })
            .expect(HTTP_CODE.UNAUTHORIZED);

    });




    it('Should not be able to request forgotten password mail if is not email', async () => {
        await superApp
            .post('/api/v1/users/forgotten-password')
            .send({
                email: '1',
            })
            .expect(HTTP_CODE.BAD_REQUEST);
    });
});
