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
} = require('../test_helpers/DataSeeder');

const superApp = superTest(app);

describe('[WIP] CampaignDelete', () => {

    const user_seed = {
        id: 100,
        password: 'ShouldHaveLettersDigitsAndAtLeast8chars1',
        email: 'artiom.fedorov@test.com',
    };

    before(async () => {

        await DataSeeder.truncate('CampaignRepository');
        await DataSeeder.truncate('UserRepository');
        await DataSeeder.createUserHashPassword(user_seed);

    });


    it.skip('[WIP] Should be able to delete a campaign', async () => {
        const campaign_id = 10000000000;
        await superApp
            .delete(`/api/v1/campaigns/${campaign_id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(user_seed)}`)
            .expect(HTTP_CODE.OK);
    });
});
