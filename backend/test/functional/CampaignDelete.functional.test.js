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
    CampaignRepository,
    CampaignUserRepository,
    PropositionRepository,
    CampaignUserStatusRepository,
    UserPropositionResultRepository,
    UserPropositionEloResultRepository,
} = require('../../src/repositories');

const campaign_repository = CampaignRepository.getInstance();
const campaign_user_repository = CampaignUserRepository.getInstance();
const proposition_repository = PropositionRepository.getInstance();
const campaign_user_status_repository = CampaignUserStatusRepository.getInstance();
const user_proposition_result_repository = UserPropositionResultRepository.getInstance();
const user_proposition_elo_result_repository = UserPropositionEloResultRepository.getInstance();

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

describe('[WIP] CampaignDelete', () => {

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

    it('Guest user should not be able to delete a campaign', async () => {
        await superApp
            .delete(`/api/v1/campaigns/${campaign_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtGuestAccessToken(guest_user_seed)}`)
            .expect(HTTP_CODE.UNAUTHORIZED);
    });

    it.only('[WIP] Manager user should be able to delete a campaign', async () => {
        await superApp
            .delete(`/api/v1/campaigns/${campaign_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.OK);
        const campaign_list = await campaign_repository.search({
            id_list: campaign_seed.id,
        });
        // @todo check other entities
        expect(campaign_list.map((campaign) => campaign.id))
            .not.to.include(campaign_seed.id);

    });

});
