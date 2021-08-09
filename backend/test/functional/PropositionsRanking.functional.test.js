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
} = require('../helpers/DataSeeder');

const superApp = superTest(app);

describe('PropositionsRanking - Functional test', () => {

    const manager_user_seed = {
        id: 100,
        password: 'ShouldHaveLettersDigitsAndAtLeast8chars1',
        email: 'manager.user@test.com',
    };

    const campaign_seed = {
        id: 10,
        title: 'Title of campaignsss',
        description: 'Somethings',
        owner_user_id: manager_user_seed.id,
    };

    const manager_campaign_user_seed = {
        campaign_id: campaign_seed.id,
        user_id: 100,
        access_level: 3,
    };

    const guest_user_seed = {
        id: 200,
        email: 'guest.user@test.com',
    };

    const guest_campaign_user_seed = {
        campaign_id: campaign_seed.id,
        user_id: guest_user_seed.id,
        public_token: '8185933f78c749b381ad630308cd1257',
        access_level: 1,
    };

    const proposition_1_seed = {
        id: 1,
        campaign_id: campaign_seed.id,
        payload: 'Payload 1',
        creator_user_id: manager_user_seed.id,
    };

    const proposition_2_seed = {
        id: 2,
        campaign_id: campaign_seed.id,
        payload: 'Payload 2',
        creator_user_id: manager_user_seed.id,
    };

    const proposition_3_seed = {
        id: 3,
        campaign_id: campaign_seed.id,
        payload: 'Payload 3',
        creator_user_id: manager_user_seed.id,
    };

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

});
