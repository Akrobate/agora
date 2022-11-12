'use strict';

const {
    expect,
} = require('chai');
const {
    DataSeeder,
} = require('../test_helpers/DataSeeder');
const {
    campaign_user_status_1_seed,
    campaign_user_status_2_seed,
    campaign_user_status_3_seed,
} = require('../test_seeds/test_data_seeds');
const {
    CampaignUserStatusRepository,
} = require('../../src/repositories/');

describe('CampaignUserStatusRepository', () => {

    const campaign_user_status_repository = CampaignUserStatusRepository.getInstance();

    before(async () => {
        await DataSeeder.truncate('CampaignUserStatusRepository');
        await DataSeeder.create('CampaignUserStatusRepository', campaign_user_status_1_seed);
        await DataSeeder.create('CampaignUserStatusRepository', campaign_user_status_2_seed);
        await DataSeeder.create('CampaignUserStatusRepository', campaign_user_status_3_seed);
    });


    it('Should be able to search a campaign user status by id_list', async () => {
        const result = await campaign_user_status_repository.search({
            id_list: [
                campaign_user_status_3_seed.id,
            ],
        });
        expect(result).to.be.an('Array');
        expect(result.length).to.equals(1);
        const [
            first,
        ] = result;
        expect(first).to.have.property('id', campaign_user_status_3_seed.id);

    });


    it('Should be able to search a campaign user status by status_id_list', async () => {
        const result = await campaign_user_status_repository.search({
            status_id_list: [
                CampaignUserStatusRepository.STARTED,
            ],
        });
        expect(result).to.be.an('Array');
        expect(result.length).to.equals(1);
        const [
            first,
        ] = result;
        expect(first).to.have.property('id', campaign_user_status_3_seed.id);

    });

});
