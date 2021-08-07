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

    const manager_user_seed = {
        id: 100,
        password: 'ShouldHaveLettersDigitsAndAtLeast8chars1',
        email: 'manager.user@test.com',
    };

    const campaign_seed = {
        id: 10,
        title: 'Title of campaignsss',
        description: 'Somethings',
        owner_user_id: manager_user_seed.id,
    };

    const manager_campaign_user_seed = {
        campaign_id: campaign_seed.id,
        user_id: 100,
        access_level: 3,
    };

    const guest_user_seed = {
        id: 200,
        email: 'guest.user@test.com',
    };

    const guest_campaign_user_seed = {
        campaign_id: campaign_seed.id,
        user_id: guest_user_seed.id,
        public_token: '8185933f78c749b381ad630308cd1257',
        access_level: 1,
    };


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
            .get(`/api/v1/campaigns/${campaign_seed.id}/status`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtGuestAccessToken(guest_user_seed)}`)
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                expect(response.body).to.have.property('status_id', 3);
            });
    });


    it.skip('Users should belong to campaign to be able to set status');

});
