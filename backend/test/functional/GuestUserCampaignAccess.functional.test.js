'use strict';

const superTest = require('supertest');
const HTTP_CODE = require('http-status');
const qs = require('qs');

const {
    v4,
} = require('uuid');

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
    guest_user_to_delete_seed,
    guest_campaign_user_to_delete_seed,
} = require('../test_seeds/test_data_seeds');

const superApp = superTest(app);

describe('CampaignAccess', () => {

    before(async () => {

        await DataSeeder.truncate('CampaignRepository');
        await DataSeeder.truncate('CampaignUserRepository');
        await DataSeeder.truncate('UserRepository');

        await DataSeeder.createUserHashPassword(manager_user_seed);
        await DataSeeder.create('CampaignRepository', campaign_seed);
        await DataSeeder.create('CampaignUserRepository', manager_campaign_user_seed);

        await DataSeeder.create('UserRepository', guest_user_seed);
        await DataSeeder.create('CampaignUserRepository', guest_campaign_user_seed);

        await DataSeeder.create('UserRepository', guest_user_to_delete_seed);
        await DataSeeder.create('CampaignUserRepository', guest_campaign_user_to_delete_seed);

    });


    describe('Campaign members management', () => {

        it('Manager should be able to add a guest user', async () => {
            await superApp
                .post(`/api/v1/campaigns/${campaign_seed.id}/users`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .send({
                    email: 'artiom.somebody@test.com',
                    access_level: 1,
                })
                .expect(HTTP_CODE.CREATED)
                .expect((response) => {
                    expect(response.body).to.have.property('campaign_id', '10');
                    expect(response.body).to.have.property('access_level', 1);
                });
        });


        it('Manager should be able to list campaign members users', async () => {
            await superApp
                .get(`/api/v1/campaigns/${campaign_seed.id}/users`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    // console.log(response.body);
                    expect(response.body).to.have.property('campaign_user_list');

                    const manager_member = response.body.campaign_user_list
                        .find((user) => user.user_id === manager_user_seed.id);
                    expect(manager_member).to.have.property('access_level', manager_campaign_user_seed.access_level);
                    expect(manager_member).to.have.property('email', manager_user_seed.email);
                });
        });


        it('Manager should be able to update a campaign members acces', async () => {
            await superApp
                .patch(`/api/v1/campaigns/${campaign_seed.id}/users/${guest_campaign_user_seed.id}`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .send({
                    access_level: 2,
                    is_participant: true,
                })
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    expect(response.body).to.have.property('access_level', 2);
                    expect(response.body).to.have.property('id', guest_campaign_user_seed.id);
                });
            await superApp
                .patch(`/api/v1/campaigns/${campaign_seed.id}/users/${guest_campaign_user_seed.id}`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .send({
                    access_level: guest_campaign_user_seed.access_level,
                    is_participant: true,
                })
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    expect(response.body).to.have.property('access_level', guest_campaign_user_seed.access_level);
                    expect(response.body).to.have.property('id', guest_campaign_user_seed.id);
                });
        });


        it('Manager should be able to delete a campaign members', async () => {
            await superApp
                .delete(`/api/v1/campaigns/${campaign_seed.id}/users/${guest_campaign_user_to_delete_seed.id}`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    expect(response.body).to.deep.equal({});
                });
        });


        it('Guest user should not be able add a guest user', async () => {
            await superApp
                .post(`/api/v1/campaigns/${campaign_seed.id}/users`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtGuestAccessToken(guest_user_seed)}`)
                .send({
                    email: `${v4()}.${v4()}@${v4()}.${v4()}`,
                    access_level: 1,
                })
                .expect(HTTP_CODE.UNAUTHORIZED)
                .expect((response) => {
                    expect(response.body).to.have.property('message', 'Guest user is forbiden');
                });
        });

    });

    it('Guest user should not be able to create a campaign', async () => {
        await superApp
            .post('/api/v1/campaigns')
            .set('Authorization', `Bearer ${DataSeeder.getJwtGuestAccessToken(guest_user_seed)}`)
            .send({
                title: v4(),
                description: v4(),
            })
            .expect(HTTP_CODE.UNAUTHORIZED)
            .expect((response) => {
                expect(response.body).to.have.property('message', 'Guest user is forbiden');
            });
    });


    it('Guest user should be able to login', async () => {
        await superApp
            .post('/api/v1/users/login/guest')
            .send({
                public_token: guest_campaign_user_seed.public_token,
            })
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                expect(response.body).to.have.property('token');
                expect(response.body.token)
                    .to.equal(DataSeeder.getJwtGuestAccessToken(
                        guest_user_seed,
                        guest_campaign_user_seed.campaign_id
                    ));
            });
    });


    it('Guest user should be able read a campaign', async () => {
        await superApp
            .get(`/api/v1/campaigns/${campaign_seed.id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                console.log(response.body);
            });
    });

    it('Guest user should be able search a campaign', async () => {
        await superApp
            .get('/api/v1/campaigns')
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                expect(response.body).to.have.property('campaign_list');
                const [
                    campaign,
                ] = response.body.campaign_list;
                expect(campaign).to.have.property('id', 10);
                expect(campaign).to.have.property('user_access_level', 3);
                // console.log(response.body);
            });
    });

    it('Guest user should be able search a campaign IN PROGRESS', async () => {
        await superApp
            .get('/api/v1/campaigns')
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .query(qs.stringify({
                campaign_status_list: [
                    2,
                ],
            }))
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                expect(response.body).to.have.property('campaign_list');
                const [
                    campaign,
                ] = response.body.campaign_list;
                expect(campaign).to.have.property('id', 10);
                expect(campaign).to.have.property('user_access_level', 3);
                // console.log(response.body);
            });
    });

    it('Guest user should be able search a campaign IN PROGRESS', async () => {
        await superApp
            .get('/api/v1/campaigns')
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .query(qs.stringify({
                campaign_status_list: [
                    3,
                ],
            }))
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                expect(response.body).to.have.property('campaign_list');
                expect(response.body.campaign_list.length).to.equal(0);
            });
    });
});
