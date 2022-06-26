'use strict';

const {
    expect,
} = require('chai');

const {
    CampaignService,
} = require('../../src/services/');

const {
    DataSeeder,
} = require('../test_helpers/DataSeeder');


const {
    manager_user_seed,
    campaign_seed,
    manager_campaign_user_seed,
    guest_user_seed,
    guest_campaign_user_seed,
    observer_user_seed,
    observer_campaign_user_seed,
    campaign_user_status_1_seed,
    campaign_user_status_2_seed,
    campaign_user_status_3_seed,
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

describe('CampaignUpdateFinished', () => {

    const campaign_service = CampaignService.getInstance();

    before(async () => {

        await DataSeeder.truncateAll();

        await DataSeeder.createUserHashPassword(manager_user_seed);
        await DataSeeder.create('CampaignRepository', campaign_seed);
        await DataSeeder.create('CampaignUserRepository', manager_campaign_user_seed);

        await DataSeeder.create('UserRepository', guest_user_seed);
        await DataSeeder.create('CampaignUserRepository', guest_campaign_user_seed);

        await DataSeeder.create('UserRepository', observer_user_seed);
        await DataSeeder.create('CampaignUserRepository', observer_campaign_user_seed);

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
        await DataSeeder.create('CampaignUserStatusRepository', campaign_user_status_3_seed);

    });

    it('UpdateFinished method should update campaign status if finished', async () => {
        await campaign_service.updateCampaignIfFinished();
    });

});
