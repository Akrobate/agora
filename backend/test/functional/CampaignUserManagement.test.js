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
    manager_user_2_seed,
    manager_campaign_user_2_seed,
} = require('../test_seeds/test_data_seeds');

const {
    CampaignUserRepository,
} = require('../../src/repositories');

const superApp = superTest(app);


describe('CampaignUserManagement', () => {

    beforeEach(async () => {
        await DataSeeder.truncateAll();

        await DataSeeder.create('CampaignRepository', campaign_seed);

        await DataSeeder.createUserHashPassword(manager_user_seed);
        await DataSeeder.create('CampaignUserRepository', manager_campaign_user_seed);

        await DataSeeder.createUserHashPassword(manager_user_2_seed);
        await DataSeeder.create('CampaignUserRepository', manager_campaign_user_2_seed);

        await DataSeeder.create('UserRepository', guest_user_seed);
        await DataSeeder.create('CampaignUserRepository', guest_campaign_user_seed);

    });

    it('Manager should not be able to remove last campaign manager', async () => {
        await superApp
            .patch(`/api/v1/campaigns/${campaign_seed.id}/users/${manager_campaign_user_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .send({
                access_level: CampaignUserRepository.GUEST,
                is_participant: true,
            })
            .expect(HTTP_CODE.OK);

        await superApp
            .patch(`/api/v1/campaigns/${campaign_seed.id}/users/${manager_campaign_user_2_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_2_seed)}`)
            .send({
                access_level: CampaignUserRepository.GUEST,
                is_participant: true,
            })
            .expect(HTTP_CODE.UNAUTHORIZED)
            .expect((response) => {
                expect(response.body).to.have.property('message', 'Last manager cannot be unsetted');
            });
    });

    it('Manager should not be able to remove another manager', async () => {
        await superApp
            .delete(`/api/v1/campaigns/${campaign_seed.id}/users/${manager_campaign_user_2_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.UNAUTHORIZED)
            .expect((response) => {
                expect(response.body).to.have.property('message', 'Manager user cannot be removed');
            });
    });


    it.skip('User should not be able to invite somebody on a draft campaign', async () => {
    });

});
