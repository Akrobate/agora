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
    campaign_user_status_1_seed,
    campaign_user_status_2_seed,
    proposition_1_seed,
    proposition_2_seed,
    proposition_3_seed,
    guest_user_proposition_result_1,
    guest_user_proposition_result_2,
    guest_user_proposition_result_3,
    manager_user_proposition_result_1,
    manager_user_proposition_result_2,
    manager_user_proposition_result_3,
} = require('../test_seeds/test_data_seeds');

const superApp = superTest(app);

describe.only('[WIP] CampaignDelete', () => {

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


    it.skip('[WIP] Manager user should be able to delete a campaign', async () => {
        await superApp
            .delete(`/api/v1/campaigns/${campaign_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.OK);
    });

    it.skip('[WIP] Guest user should not be able to delete a campaign', async () => {
        await superApp
            .delete(`/api/v1/campaigns/${campaign_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(guest_user_seed)}`)
            .expect(HTTP_CODE.OK);
    });
});
