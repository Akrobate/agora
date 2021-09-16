'use strict';

const superTest = require('supertest');
const HTTP_CODE = require('http-status');
const qs = require('qs');

const moment = require('moment');

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

describe('CampaignPropositionResult', () => {

    const manager_user_seed = {
        id: 100,
        password: 'ShouldHaveLettersDigitsAndAtLeast8chars1',
        email: 'manager.user@test.com',
    };

    const campaign_seed = {
        id: 10,
        title: 'Title of campaignsss',
        description: 'Somethings',
        campaign_status: 2,
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
        id: 201,
        campaign_id: campaign_seed.id,
        user_id: guest_user_seed.id,
        public_token: '8185933f78c749b381ad630308cd1257',
        access_level: 1,
    };


    const campaign_user_status_1_seed = {
        campaign_id: campaign_seed.id,
        status_id: 3,
        user_id: manager_user_seed.id,
        date: moment().toISOString(),
    };

    const campaign_user_status_2_seed = {
        campaign_id: campaign_seed.id,
        status_id: 3,
        user_id: guest_user_seed.id,
        date: moment().toISOString(),
    };


    const proposition_1_seed = {
        id: 1,
        campaign_id: campaign_seed.id,
        payload: 'A',
        creator_user_id: manager_user_seed.id,
    };

    const proposition_2_seed = {
        id: 2,
        campaign_id: campaign_seed.id,
        payload: 'B',
        creator_user_id: manager_user_seed.id,
    };

    const proposition_3_seed = {
        id: 3,
        campaign_id: campaign_seed.id,
        payload: 'C',
        creator_user_id: manager_user_seed.id,
    };

    // guest prop
    const guest_user_proposition_result_1 = {
        campaign_id: campaign_seed.id,
        user_id: guest_user_seed.id,
        proposition_id: proposition_1_seed.id,
        rank: 1,
    };

    const guest_user_proposition_result_2 = {
        campaign_id: campaign_seed.id,
        user_id: guest_user_seed.id,
        proposition_id: proposition_2_seed.id,
        rank: 2,
    };

    const guest_user_proposition_result_3 = {
        campaign_id: campaign_seed.id,
        user_id: guest_user_seed.id,
        proposition_id: proposition_3_seed.id,
        rank: 3,
    };

    // manager prop
    const manager_user_proposition_result_1 = {
        campaign_id: campaign_seed.id,
        user_id: manager_user_seed.id,
        proposition_id: proposition_1_seed.id,
        rank: 1,
    };

    const manager_user_proposition_result_2 = {
        campaign_id: campaign_seed.id,
        user_id: manager_user_seed.id,
        proposition_id: proposition_2_seed.id,
        rank: 3,
    };

    const manager_user_proposition_result_3 = {
        campaign_id: campaign_seed.id,
        user_id: manager_user_seed.id,
        proposition_id: proposition_3_seed.id,
        rank: 2,
    };


    before(async () => {

        await DataSeeder.truncate('CampaignRepository');
        await DataSeeder.truncate('CampaignUserRepository');
        await DataSeeder.truncate('CampaignUserStatusRepository');
        await DataSeeder.truncate('UserRepository');
        await DataSeeder.truncate('PropositionRepository');
        await DataSeeder.truncate('UserPropositionResultRepository');

        await DataSeeder.createUserHashPassword(manager_user_seed);
        await DataSeeder.create('CampaignRepository', campaign_seed);
        await DataSeeder.create('CampaignUserRepository', manager_campaign_user_seed);

        await DataSeeder.create('UserRepository', guest_user_seed);
        await DataSeeder.create('CampaignUserRepository', guest_campaign_user_seed);

        await DataSeeder.create('PropositionRepository', proposition_1_seed);
        await DataSeeder.create('PropositionRepository', proposition_2_seed);
        await DataSeeder.create('PropositionRepository', proposition_3_seed);

        await DataSeeder.create('UserPropositionResultRepository', manager_user_proposition_result_1);
        await DataSeeder.create('UserPropositionResultRepository', manager_user_proposition_result_2);
        await DataSeeder.create('UserPropositionResultRepository', manager_user_proposition_result_3);

        await DataSeeder.create('UserPropositionResultRepository', guest_user_proposition_result_1);
        await DataSeeder.create('UserPropositionResultRepository', guest_user_proposition_result_2);
        await DataSeeder.create('UserPropositionResultRepository', guest_user_proposition_result_3);

        await DataSeeder.create('CampaignUserStatusRepository', campaign_user_status_1_seed);
        await DataSeeder.create('CampaignUserStatusRepository', campaign_user_status_2_seed);
    });


    describe('CampaignPropositionResult', () => {

        it('Unkwnown algorithm field shoud be rejected', async () => {
            await superApp
                .get(`/api/v1/campaigns/${campaign_seed.id}/proposition-results`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .query(qs.stringify({
                    algorithm: 'birda',
                    user_id_list: [100, 200],
                }))
                .expect(HTTP_CODE.BAD_REQUEST);
        });


        it('Manager should be able get campaign proposition borda result', async () => {
            await superApp
                .get(`/api/v1/campaigns/${campaign_seed.id}/proposition-results`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .query(qs.stringify({
                    algorithm: 'borda',
                    user_id_list: [100, 200],
                }))
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    // console.log('response.body', response.body);
                    expect(response.body).to.have.property('proposition_result_list');
                    expect(response.body.proposition_result_list).to.be.an('Array');
                    expect(response.body.proposition_result_list[0].proposition_id).to.equal(1);
                });
        });

        it('Manager should be able get campaign proposition relative_majority result', async () => {
            await superApp
                .get(`/api/v1/campaigns/${campaign_seed.id}/proposition-results`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .query(qs.stringify({
                    algorithm: 'relative_majority',
                    user_id_list: [100, 200],
                }))
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    // console.log('response.body', response.body);
                    expect(response.body).to.have.property('proposition_result_list');
                    expect(response.body.proposition_result_list).to.be.an('Array');
                    expect(response.body.proposition_result_list[0].proposition_id).to.equal(1);
                });
        });
    });
});
