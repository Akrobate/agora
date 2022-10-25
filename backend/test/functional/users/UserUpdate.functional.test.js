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

describe('User should be able to update it self', () => {

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


    it('Should be able to update a user', async () => {

        await superApp
            .get(`/api/v1/users/${user_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(user_seed)}`)
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                expect(response.body).to.have.property('first_name', user_seed.first_name);
                expect(response.body).to.have.property('last_name', user_seed.last_name);
            });

        await superApp
            .patch(`/api/v1/users/${user_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(user_seed)}`)
            .send({
                first_name: 'Artiom UPDATED',
            })
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {
                expect(response.body).to.have.property('id');
                expect(response.body).to.have.property('first_name', 'Artiom UPDATED');
            });

    });


    it('Should not be able to update an other user', async () => {
        await superApp
            .patch(`/api/v1/users/${user_seed.id + 10000}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(user_seed)}`)
            .send({
                first_name: 'Artiom UPDATED',
            })
            .expect(HTTP_CODE.UNAUTHORIZED)
            .expect((response) => {
                expect(response.body).to.have.property(
                    'message',
                    'User can only modify own data'
                );
            });
    });


    describe('Update user own password', () => {

        it('Should be able to update password', async () => {

            const new_password = 'CoucouNouveauPass8';

            await superApp
                .post('/api/v1/users/login')
                .send({
                    password: user_seed.password,
                    email: user_seed.email,
                })
                .expect(HTTP_CODE.OK);

            await superApp
                .patch(`/api/v1/users/${user_seed.id}/password`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(user_seed)}`)
                .send({
                    old_password: user_seed.password,
                    new_password,
                })
                .expect(HTTP_CODE.CREATED);

            await superApp
                .post('/api/v1/users/login')
                .send({
                    password: new_password,
                    email: user_seed.email,
                })
                .expect(HTTP_CODE.OK);

            await superApp
                .post('/api/v1/users/login')
                .send({
                    password: user_seed.password,
                    email: user_seed.email,
                })
                .expect(HTTP_CODE.UNAUTHORIZED);
        });

        it('Should not be able to update password with bad old password', async () => {
            await superApp
                .patch(`/api/v1/users/${user_seed.id}/password`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(user_seed)}`)
                .send({
                    old_password: 'BAD_PASSWORD',
                    new_password: 'CoucouNouveauPass8',
                })
                .expect(HTTP_CODE.FORBIDDEN);
        });
    });



    describe('User Service error test', () => {

        it('Should throw an error on unexisting user', async () => {
            const unexisting_user_seed = {
                id: 33300,
            };

            await superApp
                .get(`/api/v1/users/${unexisting_user_seed.id}`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(unexisting_user_seed)}`)
                .expect(HTTP_CODE.UNAUTHORIZED)
                .expect((response) => {
                    expect(response.body).to.have.property('message', 'User data cannot be accessed');
                });
        });
    })
});

