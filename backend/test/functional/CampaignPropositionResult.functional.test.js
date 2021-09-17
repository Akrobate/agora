'use strict';

const superTest = require('supertest');
const HTTP_CODE = require('http-status');
const qs = require('qs');

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
} = require('../test_seeds/campaign_propositions_results_seeds');

const superApp = superTest(app);

describe('CampaignPropositionResult', () => {

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


    describe('CampaignPropositionResult', () => {

        it('Unkwnown algorithm field shoud be rejected', async () => {
            await superApp
                .get(`/api/v1/campaigns/${campaign_seed.id}/proposition-results`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .query(qs.stringify({
                    algorithm: 'birda',
                    user_id_list: [100, 200],
                }))
                .expect(HTTP_CODE.BAD_REQUEST);
        });


        it('Manager should be able get campaign proposition borda result', async () => {
            await superApp
                .get(`/api/v1/campaigns/${campaign_seed.id}/proposition-results`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .query(qs.stringify({
                    algorithm: 'borda',
                    user_id_list: [100, 200],
                }))
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    // console.log('response.body', response.body);
                    expect(response.body).to.have.property('proposition_result_list');
                    expect(response.body.proposition_result_list).to.be.an('Array');
                    expect(response.body.proposition_result_list[0].proposition_id).to.equal(1);
                });
        });

        it('Manager should be able get campaign proposition relative_majority result', async () => {
            await superApp
                .get(`/api/v1/campaigns/${campaign_seed.id}/proposition-results`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .query(qs.stringify({
                    algorithm: 'relative_majority',
                    user_id_list: [100, 200],
                }))
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    // console.log('response.body', response.body);
                    expect(response.body).to.have.property('proposition_result_list');
                    expect(response.body.proposition_result_list).to.be.an('Array');
                    expect(response.body.proposition_result_list[0].proposition_id).to.equal(1);
                });
        });
    });
});
