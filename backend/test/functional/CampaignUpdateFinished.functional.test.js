'use strict';

const moment = require('moment');

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

describe('updateCampaignIfFinished method', () => {

    const campaign_service = CampaignService.getInstance();
    const campaign_repository = CampaignRepository.getInstance();

    const campaign_seed_expired = {
        id: 5,
        title: 'Title of campaignsss TIME EXPIRED',
        description: 'Somethings',
        proposition_type: 'Proposition_type',
        campaign_status: CampaignRepository.STATUS_IN_PROGRESS, // STATUS_IN_PROGRESS
        owner_user_id: 10001,
        start_date: moment()
            .subtract(8, 'days')
            .toISOString(),
        end_date: moment()
            .subtract(1, 'days')
            .toISOString(),
    };

    const campaign_seed_not_expired = {
        id: 4,
        title: 'Title of campaignsss TIME NOT EXPIRED',
        description: 'Somethings',
        proposition_type: 'Proposition_type',
        campaign_status: CampaignRepository.STATUS_IN_PROGRESS, // STATUS_IN_PROGRESS
        owner_user_id: 10001,
        start_date: moment()
            .subtract(8, 'days')
            .toISOString(),
        end_date: moment()
            .add(1, 'days')
            .toISOString(),
    };

    before(async () => {
        await DataSeeder.truncateAll();
        await DataSeeder.create('CampaignRepository', campaign_seed_not_expired);
        await DataSeeder.create('CampaignRepository', campaign_seed_expired);
    });

    it('Should update status of finished campaign', async () => {
        await campaign_service.updateCampaignIfFinished(campaign_seed_expired.id);
        const [
            updated_campaign,
        ] = await campaign_repository.search({
            id: campaign_seed_expired.id,
        });
        expect(updated_campaign).to.have.property('campaign_status', CampaignRepository.STATUS_FINISHED);
    });

    it('Should not update a not finished campaign', async () => {
        await campaign_service.updateCampaignIfFinished(campaign_seed_not_expired.id);
        const [
            updated_campaign,
        ] = await campaign_repository.search({
            id: campaign_seed_not_expired.id,
        });
        expect(updated_campaign).to.have.property('campaign_status', CampaignRepository.STATUS_IN_PROGRESS);
    });

});
