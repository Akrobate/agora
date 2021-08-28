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
} = require('../helpers/DataSeeder');
const {
    app,
} = require('../../src/app');

const superApp = superTest(app);

describe('UserRegistrationDataAccess', () => {

    const user_seed = {
        id: 300,
        first_name: 'Artiom',
        last_name: 'Fedorov',
        password: 'ShouldHaveLettersDigitsAndAtLeast8chars',
        email: `artiom.fedorov@${v4()}.com`,
    };

    const guest_user_seed = {
        id: 200,
        email: 'guest.user@test.com',
    };

    before(async () => {
        await DataSeeder.truncate('UserRepository');
        await DataSeeder.createUserHashPassword(user_seed);
        await DataSeeder.create('UserRepository', guest_user_seed);
    });


    describe('Registration tests', () => {

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


        it('Should be able to register an existing and guest user', async () => {
            const guest_registration_data = {
                first_name: `first_name ${v4()}`,
                last_name: `last_name ${v4()}`,
                password: 'Azert987654',
                email: guest_user_seed.email,
            };
            await superApp
                .post('/api/v1/users/register')
                .send(guest_registration_data)
                .expect(HTTP_CODE.CREATED)
                .expect((response) => {
                    expect(response.body).to.have.property('email', guest_registration_data.email);
                    expect(response.body).to.have.property('first_name', guest_registration_data.first_name);
                    expect(response.body).to.have.property('last_name', guest_registration_data.last_name);
                });
        });

    });


    it('Should be able to read own user data', async () => {
        await superApp
            .get(`/api/v1/users/${user_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(user_seed)}`)
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                expect(response.body).to.have.property('email', user_seed.email);
                expect(response.body).to.have.property('first_name', user_seed.first_name);
                expect(response.body).to.have.property('last_name', user_seed.last_name);
            });
    });

    it('Should not be able to read other user data', async () => {
        await superApp
            .get(`/api/v1/users/${user_seed.id + 1000}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(user_seed)}`)
            .expect(HTTP_CODE.UNAUTHORIZED);
    });


    it('Should not be able to read user data without token', async () => {
        await superApp
            .get(`/api/v1/users/${user_seed.id}`)
            .expect(HTTP_CODE.UNAUTHORIZED);
    });


    it.skip('Should be able to update own user data', async () => {
        const update_data = {
            first_name: 'Changed first name',
            last_name: 'changed last name',
        };

        await superApp
            .patch(`/api/v1/users/${user_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(user_seed)}`)
            .send(update_data)
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                expect(response.body).to.have.property('email', user_seed.email);
                expect(response.body).to.have.property('first_name', update_data.first_name);
                expect(response.body).to.have.property('last_name', update_data.last_name);
            });
    });

});
