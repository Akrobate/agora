'use strict';

const {
    expect,
} = require('chai');

const {
    CampaignService,
} = require('../../src/services/');

const {
    CampaignRepository,
} = require('../../src/repositories/');

const {
    DataSeeder,
} = require('../test_helpers/DataSeeder');

describe.only('CampaignUpdateFinished', () => {

    const campaign_service = CampaignService.getInstance();
    const campaign_repository = CampaignRepository.getInstance();

    const campaign_seed_expired = {
        id: 5,
        title: 'Title of campaignsss TIME EXPIRED',
        description: 'Somethings',
        proposition_type: 'Proposition_type',
        campaign_status: CampaignRepository.STATUS_IN_PROGRESS, // STATUS_IN_PROGRESS
        owner_user_id: 10001,
    };

    before(async () => {

        await DataSeeder.truncateAll();
        await DataSeeder.create('CampaignRepository', campaign_seed_expired);

    });

    it('UpdateFinished method should update campaign status if finished', async () => {
        await campaign_service.updateCampaignIfFinished(campaign_seed_expired.id);

        const updated_campaign_list = await campaign_repository.search({
            id_list: [
                campaign_seed_expired.id,
            ],
        });
        const [
            updated_campaign_id,
        ] = updated_campaign_list;
        expect(updated_campaign_id).to.have.property('campaign_status', CampaignRepository.STATUS_FINISHED);
    });

});
