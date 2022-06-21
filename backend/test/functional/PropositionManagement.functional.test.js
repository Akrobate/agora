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

describe('CampaignAccess', () => {

    const not_manager_user_seed = {
        id: 400,
        password: 'Nevermind',
        email: 'not_manager.user@test.com',
    };

    const proposition_to_read_seed = {
        id: 1,
        campaign_id: campaign_seed.id,
        payload: 'If you see me, the developper is a genius!',
        creator_user_id: manager_user_seed.id,
    };

    const proposition_to_delete_seed = {
        id: 2,
        campaign_id: campaign_seed.id,
        payload: 'If you see me, the developper is an ass hole!',
        creator_user_id: manager_user_seed.id,
    };

    const proposition_to_not_delete_seed = {
        id: 3,
        campaign_id: campaign_seed.id,
        payload: 'If dont see me, the developper is an ass hole!',
        creator_user_id: manager_user_seed.id,
    };

    before(async () => {

        await DataSeeder.truncate('CampaignRepository');
        await DataSeeder.truncate('CampaignUserRepository');
        await DataSeeder.truncate('UserRepository');
        await DataSeeder.truncate('PropositionRepository');

        await DataSeeder.createUserHashPassword(manager_user_seed);
        await DataSeeder.createUserHashPassword(not_manager_user_seed);
        await DataSeeder.create('CampaignRepository', campaign_seed);
        await DataSeeder.create('CampaignUserRepository', manager_campaign_user_seed);

        await DataSeeder.create('UserRepository', guest_user_seed);
        await DataSeeder.create('CampaignUserRepository', guest_campaign_user_seed);

        await DataSeeder.create('PropositionRepository', proposition_to_read_seed);
        await DataSeeder.create('PropositionRepository', proposition_to_delete_seed);
        await DataSeeder.create('PropositionRepository', proposition_to_not_delete_seed);

    });


    it('Manager should be able to add a proposition', async () => {
        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/propositions`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .send({
                payload: 'Test 1',
            })
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {
                // console.log(response.body);
                expect(response.body).to.have.property('campaign_id', `${campaign_seed.id}`);
                expect(response.body).to.have.property('payload', 'Test 1');
            });
    });


    it('Guest should not be able add a proposition', async () => {
        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/propositions`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtGuestAccessToken(guest_user_seed)}`)
            .send({
                payload: 'Test 1',
            })
            .expect(HTTP_CODE.UNAUTHORIZED)
            .expect((response) => {
                expect(response.body).to.have.property('message', 'Guest user is forbiden');
            });
    });


    it('User that not a campaign manager should not be able to create a proposition', async () => {
        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/propositions`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(not_manager_user_seed)}`)
            .send({
                payload: 'Test 1',
            })
            .expect(HTTP_CODE.UNAUTHORIZED)
            .expect((response) => {
                expect(response.body).to.have.property('message', 'User must be a campaign manager');
            });
    });


    it('Manager should be able to read a proposition', async () => {
        await superApp
            .get(`/api/v1/campaigns/${campaign_seed.id}/propositions/${proposition_to_read_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                expect(response.body).to.have.property('id', proposition_to_read_seed.id);
                expect(response.body).to.have.property('payload', proposition_to_read_seed.payload);
            });
    });

    it('Non manager should not be able to read a proposition', async () => {
        await superApp
            .get(`/api/v1/campaigns/${campaign_seed.id}/propositions/${proposition_to_read_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(not_manager_user_seed)}`)
            .expect(HTTP_CODE.UNAUTHORIZED)
            .expect((response) => {
                expect(response.body).to.have.property('message', 'User must be a campaign member');
            });
    });

    it('Manager should be able to delete a proposition', async () => {
        await superApp
            .delete(`/api/v1/campaigns/${campaign_seed.id}/propositions/${proposition_to_delete_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.NO_CONTENT);
    });

    it('Guest should not be able to delete a proposition', async () => {
        await superApp
            .delete(`/api/v1/campaigns/${campaign_seed.id}/propositions/${proposition_to_not_delete_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtGuestAccessToken(guest_user_seed)}`)
            .expect(HTTP_CODE.UNAUTHORIZED)
            .expect((response) => {
                expect(response.body).to.have.property('message', 'Guest user is forbiden');
            });
    });

    it('Manager should be able to search propositions', async () => {
        await superApp
            .get(`/api/v1/campaigns/${campaign_seed.id}/propositions`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                expect(response.body).to.have.property('proposition_list');
                expect(response.body.proposition_list).to.be.an('Array');
            });
    });

});
