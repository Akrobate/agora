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

const superApp = superTest(app);

describe('CampaignUpdate', () => {

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

    it('Guest user should not be able to update a campaign', async () => {
        await superApp
            .patch(`/api/v1/campaigns/${campaign_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtGuestAccessToken(guest_user_seed)}`)
            .expect(HTTP_CODE.UNAUTHORIZED);
    });

    it('Manager user should be able to update a campaign', async () => {
        await superApp
            .patch(`/api/v1/campaigns/${campaign_seed.id}`)
            .send({
                title: 'Title of campaign Updated UPDATED',
            })
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.CREATED);
    });


    it('Observer user should not be able to update a campaign', async () => {
        await superApp
            .patch(`/api/v1/campaigns/${campaign_seed.id}`)
            .send({
                title: 'Title of campaign Updated SHOUD NOT BE UPDATED',
            })
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(observer_user_seed)}`)
            .expect(HTTP_CODE.UNAUTHORIZED)
            .expect((response) => {
                expect(response.body).to.have.property('message', 'User must be a campaign manager');
            });
    });


    describe('Updating proposition type with existing propositions', () => {

        it('Manager user should be able to update proposition type if is the same proposition type setted', async () => {
            await superApp
                .patch(`/api/v1/campaigns/${campaign_seed.id}`)
                .send({
                    proposition_type: 'Proposition_type',
                })
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .expect(HTTP_CODE.CREATED);
        });


        it('Manager user should not be able to update proposition type because has other type propositions', async () => {
            await superApp
                .patch(`/api/v1/campaigns/${campaign_seed.id}`)
                .send({
                    proposition_type: 'Proposition_type_CHANGE',
                })
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .expect(HTTP_CODE.BAD_REQUEST)
                .expect((response) => {
                    expect(response.body).to.have.property(
                        'message',
                        'This campaign has allready some setted proposition, proposition type cannot be modified'
                    );
                });
        });
    });
});
