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

describe('Campaign expiration management and updates', () => {

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

    const campaign_seed_draft = {
        id: 3,
        title: 'Title of campaignsss TIME NOT EXPIRED',
        description: 'Somethings',
        proposition_type: 'Proposition_type',
        campaign_status: CampaignRepository.STATUS_DRAFT, // STATUS_IN_PROGRESS
        owner_user_id: 10001,
    };

    const campaign_seed_finished = {
        id: 2,
        title: 'Title of campaignsss TIME NOT EXPIRED',
        description: 'Somethings',
        proposition_type: 'Proposition_type',
        campaign_status: CampaignRepository.STATUS_FINISHED, // STATUS_IN_PROGRESS
        owner_user_id: 10001,
    };

    beforeEach(async () => {
        await DataSeeder.truncateAll();
        await DataSeeder.create('CampaignRepository', campaign_seed_draft);
        await DataSeeder.create('CampaignRepository', campaign_seed_finished);
        await DataSeeder.create('CampaignRepository', campaign_seed_not_expired);
        await DataSeeder.create('CampaignRepository', campaign_seed_expired);
    });


    describe('updateCampaignIfFinished', () => {

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

    describe('searchExpiredCampaigns', () => {
        it('Should be able to searchExpiredCampaigns', async () => {
            const to_update_campaign_list = await campaign_service.searchExpiredCampaigns();
            const [
                to_update_campaign,
            ] = to_update_campaign_list;
            expect(to_update_campaign).to.have.property('id', campaign_seed_expired.id);
        });
    });

    describe('processUpdateExpiredCampaigns', () => {
        it('Should be able to processUpdateExpiredCampaigns', async () => {
            await campaign_service.processUpdateExpiredCampaigns();
            const campaigns_list = await campaign_repository.search();

            const campaign_expired = campaigns_list
                .find((campaign) => campaign.id === campaign_seed_expired.id);

            const campaign_draft = campaigns_list
                .find((campaign) => campaign.id === campaign_seed_draft.id);

            expect(campaign_expired).to.have.property('campaign_status', CampaignRepository.STATUS_FINISHED);
            expect(campaign_draft).to.have.property('campaign_status', CampaignRepository.STATUS_DRAFT);
        });
    });
});
