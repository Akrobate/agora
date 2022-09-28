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

const {
    manager_user_seed,
    campaign_seed,
    manager_campaign_user_seed,
    guest_user_seed,
    guest_campaign_user_seed,
} = require('../test_seeds/test_data_seeds');

const superApp = superTest(app);


describe('CampaignUserManagement', () => {

    before(async () => {

        await DataSeeder.truncate('CampaignRepository');
        await DataSeeder.truncate('CampaignUserRepository');
        await DataSeeder.truncate('CampaignUserStatusRepository');
        await DataSeeder.truncate('UserRepository');

        await DataSeeder.createUserHashPassword(manager_user_seed);
        await DataSeeder.create('CampaignRepository', campaign_seed);

        await DataSeeder.create('CampaignUserRepository', manager_campaign_user_seed);

        await DataSeeder.create('UserRepository', guest_user_seed);
        await DataSeeder.create('CampaignUserRepository', guest_campaign_user_seed);

    });

    // @todo implement test
    it.only('Manager should not be able to remove last campaign manager', async () => {
        console.log(manager_campaign_user_seed)
        await superApp
            .patch(`/api/v1/campaigns/${campaign_seed.id}/users/${manager_campaign_user_seed.user_id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .send({
                access_level: 1,
                is_participant: true,
            })
            .expect(HTTP_CODE.UNAUTHORIZED)
            // .expect((response) => {
            //     expect(response.body).to.have.property('status_id', 1);
            // });
    });


    // @todo implement test
    it.skip('Manager should not be able to remove another manager', async () => {
        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/status`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .send({
                status_id: 1,
            })
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {
                expect(response.body).to.have.property('status_id', 1);
            });
    });


});
