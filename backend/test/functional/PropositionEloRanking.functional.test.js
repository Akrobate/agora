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
    manager_user_seed,
    campaign_seed,
    manager_campaign_user_seed,
    guest_user_seed,
    guest_campaign_user_seed,
    proposition_1_seed,
    proposition_2_seed,
    proposition_3_seed,
} = require('../test_seeds/test_data_seeds');

const {
    DataSeeder,
} = require('../test_helpers/DataSeeder');

const superApp = superTest(app);

describe('PropositionsEloRanking - Functional test', () => {

    const guest_user_elo_result_proposition_1_seed = {
        id: 10,
        campaign_id: campaign_seed.id,
        user_id: guest_user_seed.id,
        proposition_id: 1,
        elo_score: 1000,
        display_count: 10,
    };

    const guest_user_elo_result_proposition_2_seed = {
        id: 11,
        campaign_id: campaign_seed.id,
        user_id: guest_user_seed.id,
        proposition_id: 2,
        elo_score: 1400,
        display_count: 0,
    };

    const guest_user_elo_result_proposition_3_seed = {
        id: 12,
        campaign_id: campaign_seed.id,
        user_id: guest_user_seed.id,
        proposition_id: 3,
        elo_score: 1000,
        display_count: 10,
    };


    beforeEach(async () => {
        await DataSeeder.truncate('CampaignRepository');
        await DataSeeder.truncate('CampaignUserRepository');
        await DataSeeder.truncate('UserRepository');
        await DataSeeder.truncate('PropositionRepository');
        await DataSeeder.truncate('UserPropositionEloResultRepository');


        await DataSeeder.createUserHashPassword(manager_user_seed);
        await DataSeeder.create('CampaignRepository', campaign_seed);
        await DataSeeder.create('CampaignUserRepository', manager_campaign_user_seed);

        await DataSeeder.create('UserRepository', guest_user_seed);
        await DataSeeder.create('CampaignUserRepository', guest_campaign_user_seed);

        await DataSeeder.create('PropositionRepository', proposition_1_seed);
        await DataSeeder.create('PropositionRepository', proposition_2_seed);
        await DataSeeder.create('PropositionRepository', proposition_3_seed);

        await DataSeeder.create('UserPropositionEloResultRepository', guest_user_elo_result_proposition_1_seed);
        await DataSeeder.create('UserPropositionEloResultRepository', guest_user_elo_result_proposition_2_seed);
        await DataSeeder.create('UserPropositionEloResultRepository', guest_user_elo_result_proposition_3_seed);
    });


    it('User should be able to init elo ranking', async () => {
        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/init-elo-ranking`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {

                expect(response.body).to.have.property('user_proposition_elo_result_list');
                expect(response.body.user_proposition_elo_result_list).to.be.an('Array');
                expect(response.body.user_proposition_elo_result_list.length).to.equal(3);
                const [
                    proposition_1,
                    proposition_2,
                    proposition_3,
                ] = response.body.user_proposition_elo_result_list;
                expect(proposition_1).to.have.property('elo_score', 1000);
                expect(proposition_2).to.have.property('elo_score', 1000);
                expect(proposition_3).to.have.property('elo_score', 1000);

                expect(proposition_1).to.have.property('display_count', 0);
                expect(proposition_2).to.have.property('display_count', 0);
                expect(proposition_3).to.have.property('display_count', 0);
            });
    });


    it('User should be able to init elo ranking twice', async () => {
        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/init-elo-ranking`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {
                expect(response.body).to.have.property('user_proposition_elo_result_list');
                expect(response.body.user_proposition_elo_result_list).to.be.an('Array');
                expect(response.body.user_proposition_elo_result_list.length).to.equal(3);
            });
        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/init-elo-ranking`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {
                expect(response.body).to.have.property('user_proposition_elo_result_list');
                expect(response.body.user_proposition_elo_result_list).to.be.an('Array');
                expect(response.body.user_proposition_elo_result_list.length).to.equal(0);
            });
    });


    it('User should be able to set duel results with prop1 winning', async () => {

        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/elo-duel-result`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtGuestAccessToken(guest_user_seed)}`)
            .send({
                proposition_id_1: 1,
                proposition_id_2: 3,
                winner: 1,
            })
            .expect(HTTP_CODE.OK)
            .expect((response) => {

                expect(response.body).to.have.property('user_proposition_elo_result_list');
                expect(response.body.user_proposition_elo_result_list).to.be.an('Array');
                const [
                    proposition_1,
                    proposition_2,
                ] = response.body.user_proposition_elo_result_list;

                expect(proposition_1).to.have.property('elo_score', 1020);
                expect(proposition_2).to.have.property('elo_score', 980);

                expect(proposition_1).to.have.property('display_count', 11);
                expect(proposition_2).to.have.property('display_count', 11);
            });
    });


    it('User should be able to set duel results with prop2 winning', async () => {

        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/elo-duel-result`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtGuestAccessToken(guest_user_seed)}`)
            .send({
                proposition_id_1: 1,
                proposition_id_2: 3,
                winner: 2,
            })
            .expect(HTTP_CODE.OK)
            .expect((response) => {

                expect(response.body).to.have.property('user_proposition_elo_result_list');
                expect(response.body.user_proposition_elo_result_list).to.be.an('Array');
                const [
                    proposition_1,
                    proposition_2,
                ] = response.body.user_proposition_elo_result_list;

                expect(proposition_1).to.have.property('elo_score', 980);
                expect(proposition_2).to.have.property('elo_score', 1020);

                expect(proposition_1).to.have.property('display_count', 11);
                expect(proposition_2).to.have.property('display_count', 11);
            });
    });

    it('User should be able to set duel results with equality', async () => {

        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/elo-duel-result`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtGuestAccessToken(guest_user_seed)}`)
            .send({
                proposition_id_1: 1,
                proposition_id_2: 3,
                winner: 0,
            })
            .expect(HTTP_CODE.OK)
            .expect((response) => {

                expect(response.body).to.have.property('user_proposition_elo_result_list');
                expect(response.body.user_proposition_elo_result_list).to.be.an('Array');
                const [
                    proposition_1,
                    proposition_2,
                ] = response.body.user_proposition_elo_result_list;

                expect(proposition_1).to.have.property('elo_score', 1000);
                expect(proposition_2).to.have.property('elo_score', 1000);

                expect(proposition_1).to.have.property('display_count', 11);
                expect(proposition_2).to.have.property('display_count', 11);
            });
    });

    it('User should be able to get elo ranking', async () => {
        await superApp
            .get(`/api/v1/campaigns/${campaign_seed.id}/elo-ranking`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtGuestAccessToken(guest_user_seed)}`)
            .expect(HTTP_CODE.OK)
            .expect(({
                body,
            }) => {
                expect(body).to.have.property('user_proposition_elo_result_list');
                const [
                    prop_1,
                    prop_2,
                    prop_3,
                ] = body.user_proposition_elo_result_list;
                expect(prop_1).to.have.property('id', 11);
                expect(prop_2).to.have.property('id', 10);
                expect(prop_3).to.have.property('id', 12);
            });
    });


    it('User should be able to get 2 random propositions', async () => {
        await superApp
            .get(`/api/v1/campaigns/${campaign_seed.id}/elo-random-propositions`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtGuestAccessToken(guest_user_seed)}`)
            .expect(HTTP_CODE.OK)
            .expect(({
                body,
            }) => {
                expect(body).to.have.property('random_propositions');
                const [
                    prop_1,
                    prop_2,
                ] = body.random_propositions;
                // console.log(body.random_propositions);
                expect(prop_1).to.have.property('proposition_id');
                expect(prop_2).to.have.property('proposition_id');
                expect(prop_1.proposition_id).not.to.equal(prop_2.proposition_id);
            });
    });


});
