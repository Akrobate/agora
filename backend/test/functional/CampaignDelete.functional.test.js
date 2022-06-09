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

    it('[WIP] Manager user should be able to delete a campaign', async () => {
        await superApp
            .delete(`/api/v1/campaigns/${campaign_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.OK);

        // Should not include campaign anymore
        const campaign_list = await campaign_repository.search({
            id_list: campaign_seed.id,
        });
        expect(campaign_list.map((campaign) => campaign.id))
            .not.to.include(campaign_seed.id);

        // Should not include campaign user
        const campaign_user_list = await campaign_user_repository.search({
            campaign_id: campaign_seed.id,
        });
        expect(campaign_user_list.map((campaign_user) => campaign_user.campaign_id))
            .not.to.include(campaign_seed.id);

        // Should not include proposition_list
        const proposition_list = await proposition_repository.search({
            campaign_id: campaign_seed.id,
        });
        expect(proposition_list.map((proposition) => proposition.campaign_id))
            .not.to.include(campaign_seed.id);

        // Should not include campaign_user_status_list
        const campaign_user_status_list = await campaign_user_status_repository.search({
            campaign_id: campaign_seed.id,
        });
        expect(campaign_user_status_list
            .map((campaign_user_status) => campaign_user_status.campaign_id))
            .not.to.include(campaign_seed.id);

        // Should not include user_proposition_result_list
        const user_proposition_result_list = await user_proposition_result_repository.search({
            campaign_id: campaign_seed.id,
        });
        expect(user_proposition_result_list
            .map((user_proposition_result) => user_proposition_result.campaign_id))
            .not.to.include(campaign_seed.id);

        // Should not include user_proposition_elo_result_list
        const user_proposition_elo_result_list = await user_proposition_elo_result_repository
            .search({
                campaign_id: campaign_seed.id,
            });

        expect(user_proposition_elo_result_list
            .map((user_proposition_elo_result) => user_proposition_elo_result.campaign_id))
            .not.to.include(campaign_seed.id);
    });


});
