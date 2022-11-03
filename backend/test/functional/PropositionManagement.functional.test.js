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
    campaign_seed,
    manager_user_seed,
    manager_campaign_user_seed,
    guest_user_seed,
    guest_campaign_user_seed,
    proposition_1_seed,
} = require('../test_seeds/test_data_seeds');


const superApp = superTest(app);

describe('PopositionManagement functionnal', () => {

    const not_manager_user_seed = {
        id: 400,
        password: 'Nevermind',
        email: 'not_manager.user@test.com',
    };

    const proposition_to_read_seed = {
        id: 101,
        campaign_id: campaign_seed.id,
        payload: 'If you see me, the developper is a genius!',
        creator_user_id: manager_user_seed.id,
    };

    const proposition_to_delete_seed = {
        id: 102,
        campaign_id: campaign_seed.id,
        payload: 'If you see me, the developper is an ass hole!',
        creator_user_id: manager_user_seed.id,
    };

    const proposition_to_not_delete_seed = {
        id: 103,
        campaign_id: campaign_seed.id,
        payload: 'If dont see me, the developper is an ass hole!',
        creator_user_id: manager_user_seed.id,
    };

    const draft_campaign_seed = {
        id: 20,
        title: 'Title of draft campaignsss',
        description: 'Somethings draft',
        proposition_type: 'Proposition_type',
        campaign_status: 1, // STATUS_IN_PROGRESS
        owner_user_id: manager_user_seed.id,
    };

    const manager_draft_campaign_user_seed = {
        campaign_id: draft_campaign_seed.id,
        user_id: manager_user_seed.id,
        access_level: 3,
    };

    before(async () => {

        await DataSeeder.truncateAll();

        await DataSeeder.createUserHashPassword(manager_user_seed);
        await DataSeeder.createUserHashPassword(not_manager_user_seed);

        // Draft campaign
        await DataSeeder.create('CampaignRepository', draft_campaign_seed);
        await DataSeeder.create('CampaignUserRepository', manager_draft_campaign_user_seed);

        // Started campaign (from seeds files)
        await DataSeeder.create('CampaignRepository', campaign_seed);
        await DataSeeder.create('CampaignUserRepository', manager_campaign_user_seed);

        await DataSeeder.create('UserRepository', guest_user_seed);
        await DataSeeder.create('CampaignUserRepository', guest_campaign_user_seed);

        await DataSeeder.create('PropositionRepository', proposition_to_read_seed);
        await DataSeeder.create('PropositionRepository', proposition_to_delete_seed);
        await DataSeeder.create('PropositionRepository', proposition_to_not_delete_seed);
        await DataSeeder.create('PropositionRepository', proposition_1_seed);
    });


    describe('Create proposition', () => {

        it('Manager should be able to add a proposition', async () => {
            await superApp
                .post(`/api/v1/campaigns/${campaign_seed.id}/propositions`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .send({
                    payload: 'Test 1',
                })
                .expect(HTTP_CODE.CREATED)
                .expect((response) => {
                    // console.log(response.body);
                    expect(response.body).to.have.property('campaign_id', `${campaign_seed.id}`);
                    expect(response.body).to.have.property('payload', 'Test 1');
                });
        });


        it('Guest should not be able add a proposition', async () => {
            await superApp
                .post(`/api/v1/campaigns/${campaign_seed.id}/propositions`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtGuestAccessToken(guest_user_seed)}`)
                .send({
                    payload: 'Test 1',
                })
                .expect(HTTP_CODE.UNAUTHORIZED)
                .expect((response) => {
                    expect(response.body).to.have.property('message', 'Guest user is forbiden');
                });
        });


        it('User that not a campaign manager should not be able to create a proposition', async () => {
            await superApp
                .post(`/api/v1/campaigns/${campaign_seed.id}/propositions`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(not_manager_user_seed)}`)
                .send({
                    payload: 'Test 1',
                })
                .expect(HTTP_CODE.UNAUTHORIZED)
                .expect((response) => {
                    expect(response.body).to.have.property('message', 'User must be a campaign manager');
                });
        });
    });


    describe('Read proposition', () => {
        it('Manager should be able to read a proposition', async () => {
            await superApp
                .get(`/api/v1/campaigns/${campaign_seed.id}/propositions/${proposition_to_read_seed.id}`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    expect(response.body).to.have.property('id', proposition_to_read_seed.id);
                    expect(response.body).to.have.property('payload', proposition_to_read_seed.payload);
                });
        });

        it('Non manager should not be able to read a proposition', async () => {
            await superApp
                .get(`/api/v1/campaigns/${campaign_seed.id}/propositions/${proposition_to_read_seed.id}`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(not_manager_user_seed)}`)
                .expect(HTTP_CODE.UNAUTHORIZED)
                .expect((response) => {
                    expect(response.body).to.have.property('message', 'User must be a campaign member');
                });
        });
    });


    describe('Delete proposition', () => {

        it('Manager should be able to delete a proposition', async () => {
            await superApp
                .delete(`/api/v1/campaigns/${campaign_seed.id}/propositions/${proposition_to_delete_seed.id}`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .expect(HTTP_CODE.NO_CONTENT);
        });

        it('Guest should not be able to delete a proposition', async () => {
            await superApp
                .delete(`/api/v1/campaigns/${campaign_seed.id}/propositions/${proposition_to_not_delete_seed.id}`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtGuestAccessToken(guest_user_seed)}`)
                .expect(HTTP_CODE.UNAUTHORIZED)
                .expect((response) => {
                    expect(response.body).to.have.property('message', 'Guest user is forbiden');
                });
        });

        it('Should not be able to delete a proposition if bad campaign id provided', async () => {
            const fake_campaign_id_shift = 1;
            await superApp
                .delete(`/api/v1/campaigns/${campaign_seed.id + fake_campaign_id_shift}/propositions/${proposition_to_not_delete_seed.id}`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .expect(HTTP_CODE.UNAUTHORIZED)
                .expect((response) => {
                    expect(response.body).to.have.property('message', 'Proposition does not belongs to campaign');
                });
        });
    });


    describe('Update proposition', () => {

        it('Manager should be able to create and update a proposition', async () => {
            let created_proposition_id = null;

            await superApp
                .post(`/api/v1/campaigns/${draft_campaign_seed.id}/propositions`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .send({
                    payload: 'original',
                })
                .expect(HTTP_CODE.CREATED)
                .expect((response) => {
                    expect(response.body).to.have.property('id');
                    created_proposition_id = response.body.id;
                });

            await superApp
                .patch(`/api/v1/campaigns/${draft_campaign_seed.id}/propositions/${created_proposition_id}`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .send({
                    payload: 'change',
                })
                .expect(HTTP_CODE.CREATED)
                .expect((response) => {
                    expect(response.body).to.have.property(
                        'payload',
                        'change'
                    );
                });
        });

        it('Manager should not be able to update a proposition on started campaign', async () => {
            await superApp
                .patch(`/api/v1/campaigns/${campaign_seed.id}/propositions/${proposition_1_seed.id}`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .send({
                    payload: 'change',
                })
                .expect(HTTP_CODE.BAD_REQUEST)
                .expect((response) => {
                    expect(response.body).to.have.property(
                        'message',
                        'Proposition cannot be modified once campaign started'
                    );
                });
        });

        it('Should return 404 when trying to update not existing proposition', async () => {
            const NOT_EXISTING_PROPOSITION_ID = 10001;
            await superApp
                .patch(`/api/v1/campaigns/${draft_campaign_seed.id}/propositions/${NOT_EXISTING_PROPOSITION_ID}`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .send({
                    payload: 'change',
                })
                .expect(HTTP_CODE.NOT_FOUND);
        });

        it('Should return 404 when trying to read not existing proposition', async () => {
            const NOT_EXISTING_PROPOSITION_ID = 10001;
            await superApp
                .get(`/api/v1/campaigns/${draft_campaign_seed.id}/propositions/${NOT_EXISTING_PROPOSITION_ID}`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .expect(HTTP_CODE.NOT_FOUND);
        });
    });

    it('Manager should be able to search propositions', async () => {
        await superApp
            .get(`/api/v1/campaigns/${campaign_seed.id}/propositions`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                expect(response.body).to.have.property('proposition_list');
                expect(response.body.proposition_list).to.be.an('Array');
            });
    });

});
