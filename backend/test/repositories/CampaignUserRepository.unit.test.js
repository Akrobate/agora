'use strict';

const {
    expect,
} = require('chai');
const {
    v4,
} = require('uuid');
const {
    DataSeeder,
} = require('../test_helpers/DataSeeder');
const {
    guest_user_seed,
    guest_campaign_user_seed,
} = require('../test_seeds/test_data_seeds');
const {
    CampaignUserRepository,
} = require('../../src/repositories/');

const observer_seed = {
    id: 250,
    campaign_id: 123,
    user_id: 10001,
    public_token: null,
    access_level: CampaignUserRepository.OBSERVER,
    is_participant: false,
}



describe('CampaignUserRepository', () => {

    const campaign_user_repository = CampaignUserRepository.getInstance();

    before(async () => {
        await DataSeeder.truncate('UserRepository');
        await DataSeeder.truncate('CampaignUserRepository');
        await DataSeeder.create('UserRepository', guest_user_seed);
        await DataSeeder.create('CampaignUserRepository', guest_campaign_user_seed);

        await DataSeeder.create('CampaignUserRepository', observer_seed);
    });


    it('Should be able to search a campaign user by id_list', async () => {
        const result = await campaign_user_repository.search({
            id_list: [
                guest_campaign_user_seed.id,
            ],
        });
        expect(result).to.be.an('Array');
        expect(result.length).to.equals(1);
        const [
            first,
        ] = result;
        expect(first).to.have.property('id', guest_campaign_user_seed.id);

    });


    it('Should be able to search a campaign user by user_id_list', async () => {
        const result = await campaign_user_repository.search({
            user_id_list: [
                guest_campaign_user_seed.user_id,
            ],
        });
        expect(result).to.be.an('Array');
        expect(result.length).to.equals(1);
        const [
            first,
        ] = result;
        expect(first).to.have.property('id', guest_campaign_user_seed.id);

    });


    it('Should be able to search a campaign user by is_participant', async () => {
        const result = await campaign_user_repository.search({
            is_participant: true,
        });
        expect(result).to.be.an('Array');
        expect(result.length).to.equals(1);
        const [
            first,
        ] = result;
        expect(first).to.have.property('id', guest_campaign_user_seed.id);

    });

    it('Should be able to search a campaign user by access_level OBSERVER', async () => {
        const result = await campaign_user_repository.search({
            access_level: CampaignUserRepository.OBSERVER,
        });
        expect(result).to.be.an('Array');
        expect(result.length).to.equals(1);
        const [
            first,
        ] = result;
        expect(first).to.have.property('id', observer_seed.id);

    });
});
