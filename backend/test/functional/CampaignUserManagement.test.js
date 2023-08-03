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
    manager_user_2_seed,
    manager_campaign_user_2_seed,
} = require('../test_seeds/test_data_seeds');

const {
    CampaignUserRepository,
} = require('../../src/repositories');

const superApp = superTest(app);


describe('CampaignUserManagement', () => {

    beforeEach(async () => {
        await DataSeeder.truncateAll();

        await DataSeeder.create('CampaignRepository', campaign_seed);

        await DataSeeder.createUserHashPassword(manager_user_seed);
        await DataSeeder.create('CampaignUserRepository', manager_campaign_user_seed);

        await DataSeeder.createUserHashPassword(manager_user_2_seed);
        await DataSeeder.create('CampaignUserRepository', manager_campaign_user_2_seed);

        await DataSeeder.create('UserRepository', guest_user_seed);
        await DataSeeder.create('CampaignUserRepository', guest_campaign_user_seed);

    });

    it('Manager should not be able to remove last campaign manager', async () => {
        await superApp
            .patch(`/api/v1/campaigns/${campaign_seed.id}/users/${manager_campaign_user_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .send({
                access_level: CampaignUserRepository.GUEST,
                is_participant: true,
            })
            .expect(HTTP_CODE.OK);

        await superApp
            .patch(`/api/v1/campaigns/${campaign_seed.id}/users/${manager_campaign_user_2_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_2_seed)}`)
            .send({
                access_level: CampaignUserRepository.GUEST,
                is_participant: true,
            })
            .expect(HTTP_CODE.UNAUTHORIZED)
            .expect((response) => {
                expect(response.body).to.have.property('message', 'Last manager cannot be unsetted');
            });
    });

    it('Manager should not be able to remove another manager', async () => {
        await superApp
            .delete(`/api/v1/campaigns/${campaign_seed.id}/users/${manager_campaign_user_2_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.UNAUTHORIZED)
            .expect((response) => {
                expect(response.body).to.have.property('message', 'Manager user cannot be removed');
            });
    });

    it('Should not be able to do anything on bad campaign id', async () => {
        const fake_campaign_id_shift = 878;
        await superApp
            .delete(`/api/v1/campaigns/${campaign_seed.id + fake_campaign_id_shift}/users/${manager_campaign_user_2_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.UNAUTHORIZED)
            .expect((response) => {
                expect(response.body).to.have.property('message', 'Campaign does not exists');
            });
    });

    it('Manager should able to add existing user', async () => {
        const random_access_level = 1;
        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/users`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .send({
                email: guest_user_seed.email,
                access_level: random_access_level,
                is_participant: true,
            })
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {
                expect(response.body).to.have.property('is_participant', true);
                expect(response.body).to.have.property('campaign_id', `${campaign_seed.id}`);
                expect(response.body).to.have.property('access_level', random_access_level);
                expect(response.body).to.have.property('public_token');
            });
    });


    describe('search', () => {

        it('Manager should able search a user by id', async () => {
            await superApp
                .get(`/api/v1/campaigns/${campaign_seed.id}/users`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .query(qs.stringify({
                    id_list: [
                        guest_campaign_user_seed.id,
                    ],
                }))
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    console.log(response.body);
                    expect(response.body).to.have.property('campaign_user_list');
                    expect(response.body.campaign_user_list).to.be.an('array');
                    expect(response.body.campaign_user_list.length).to.equal(1);

                    const [
                        found_element,
                    ] = response.body.campaign_user_list;

                    expect(found_element).to.have.property('id', guest_campaign_user_seed.id);
                });
        });

    });
});

