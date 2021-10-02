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
    proposition_1_seed,
    proposition_2_seed,
    proposition_3_seed,
} = require('../test_seeds/test_data_seeds');


const superApp = superTest(app);

describe('PropositionsRanking - Functional test', () => {

    before(async () => {

        await DataSeeder.truncate('CampaignRepository');
        await DataSeeder.truncate('CampaignUserRepository');
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

    });


    it('User should be able to init ranking', async () => {
        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/init-ranking`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {
                expect(response.body).to.have.property('user_proposition_result_list');
                expect(response.body.user_proposition_result_list).to.be.an('Array');
                const [
                    proposition_1,
                    proposition_2,
                    proposition_3,
                ] = response.body.user_proposition_result_list;
                expect(proposition_1).to.have.property('rank', 0);
                expect(proposition_2).to.have.property('rank', 0);
                expect(proposition_3).to.have.property('rank', 0);
            });
    });


    it('User should be able to update ranking', async () => {
        // Seeding
        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/init-ranking`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.CREATED);

        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/update-ranking`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .send({
                proposition_id_list: [3, 2, 1],
            })
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {

                expect(response.body).to.have.property('user_proposition_result_list');
                expect(response.body.user_proposition_result_list).to.be.an('Array');
                const {
                    user_proposition_result_list,
                } = response.body;
                const proposition_id_3 = user_proposition_result_list
                    .find((proposition) => proposition.proposition_id === 3);
                expect(proposition_id_3).to.have.property('rank', 1);
                const proposition_id_2 = user_proposition_result_list
                    .find((proposition) => proposition.proposition_id === 2);
                expect(proposition_id_2).to.have.property('rank', 2);
                const proposition_id_1 = user_proposition_result_list
                    .find((proposition) => proposition.proposition_id === 1);
                expect(proposition_id_1).to.have.property('rank', 3);

            });
    });


    it('User should be get own ranking', async () => {
        // Seeding
        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/init-ranking`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.CREATED);

        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/update-ranking`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .send({
                proposition_id_list: [3, 2, 1],
            })
            .expect(HTTP_CODE.CREATED);

        await superApp
            .get(`/api/v1/campaigns/${campaign_seed.id}/own-proposition-results`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .send({
                proposition_id_list: [3, 2, 1],
            })
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                expect(response.body).to.have.property('proposition_result_list');
                const {
                    proposition_result_list,
                } = response.body;
                const result_order = proposition_result_list
                    .map((proposition) => proposition.proposition_id);
                expect(result_order).to.deep.equal([3, 2, 1]);

                const [
                    first_proposition,
                ] = proposition_result_list;

                expect(first_proposition).to.have.property('payload', proposition_3_seed.payload);
            });
    });

});
