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

describe('CampaignAccess', () => {

    const user_seed = {
        password: 'ShouldHaveLettersDigitsAndAtLeast8chars1',
        email: 'artiom.fedorov@test.com',
    };

    const campagin_seed = {
        title: 'Title of campaign',
        description: 'Something',
    };

    before(async () => {

        await DataSeeder.truncate('CampaignRepository');
        await DataSeeder.truncate('UserRepository');
        await DataSeeder.createUserHashPassword(user_seed);

    });


    it('Should be able to create a campaign', async () => {

        let jwt_token = null;

        await superApp
            .post('/api/v1/users/login')
            .send(user_seed)
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                jwt_token = response.body.token;
            });

        await superApp
            .post('/api/v1/campaigns')
            .set('Authorization', `Bearer ${jwt_token}`)
            .send(campagin_seed)
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {
                console.log(response.body);
            });
    });


    it('Should not be able to create a campaign without jwt', async () => {
        await superApp
            .post('/api/v1/campaigns')
            .set('Authorization', `Bearer ${'BAD JWT StrING'}`)
            .send(campagin_seed)
            .expect(HTTP_CODE.UNAUTHORIZED)
            .expect((response) => {
                expect(response.body).to.have.property('message');
            });
    });

});
