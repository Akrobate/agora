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
} = require('../test_seeds/campaign_propositions_results_seeds');

const superApp = superTest(app);

describe('CampaignUserStatus', () => {


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


    it('Manager should be able to set campaign status', async () => {
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

    it('Manager should be able to set campaign status twice', async () => {
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

        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/status`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .send({
                status_id: 2,
            })
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {
                expect(response.body).to.have.property('status_id', 2);
            });

        await superApp
            .get(`/api/v1/campaigns/${campaign_seed.id}/status`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                expect(response.body).to.have.property('campaign_user_status_list');

                const [
                    campaign_status_1,
                    campaign_status_2,
                ] = response.body.campaign_user_status_list;
                expect(campaign_status_1).to.have.property('status_id', 1);
                expect(campaign_status_2).to.have.property('status_id', 2);
            });
    });

    it('Guest user should be able to set campaign status, and read it', async () => {
        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/status`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtGuestAccessToken(guest_user_seed)}`)
            .send({
                status_id: 1,
            })
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {
                expect(response.body).to.have.property('status_id', 1);
            });

        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/status`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtGuestAccessToken(guest_user_seed)}`)
            .send({
                status_id: 3,
            })
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {
                expect(response.body).to.have.property('status_id', 3);
            });

        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/status`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtGuestAccessToken(guest_user_seed)}`)
            .send({
                status_id: 1,
            })
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {
                expect(response.body).to.have.property('status_id', 1);
            });

        await superApp
            .get(`/api/v1/campaigns/${campaign_seed.id}/status`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtGuestAccessToken(guest_user_seed)}`)
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                expect(response.body).to.have.property('campaign_user_status_list');
                expect(response.body.campaign_user_status_list).to.have.lengthOf(2);

                const [
                    campaign_status_1,
                    campaign_status_2,
                ] = response.body.campaign_user_status_list;
                expect(campaign_status_1).to.have.property('status_id', 1);
                expect(campaign_status_2).to.have.property('status_id', 3);
            });
    });


    it.skip('Users should belong to campaign to be able to set status');

});
