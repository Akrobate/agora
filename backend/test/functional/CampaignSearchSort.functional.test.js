'use strict';

const qs = require('qs');
const moment = require('moment');
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
} = require('../test_seeds/test_data_seeds');

const superApp = superTest(app);

describe('CampaignSearchSort functionnal', () => {

    const campaign_1 = {
        id: 1010,
        title: 'A Title',
        description: 'B Somethings',
        proposition_type: 'Proposition_type',
        campaign_status: 2, // STATUS_IN_PROGRESS,
        start_date: moment()
            .add(1, 'days')
            .toISOString(),
        end_date: moment()
            .add(8, 'days')
            .toISOString(),
        owner_user_id: manager_user_seed.id,
    };
    const campaign_user_1 = {
        campaign_id: campaign_1.id,
        user_id: manager_user_seed.id,
        access_level: 3,
    };

    const campaign_2 = {
        id: 1020,
        title: 'B Title',
        description: 'B Somethings',
        proposition_type: 'Proposition_type',
        campaign_status: 2, // STATUS_IN_PROGRESS
        start_date: moment()
            .add(10, 'days')
            .toISOString(),
        end_date: moment()
            .add(18, 'days')
            .toISOString(),
        owner_user_id: manager_user_seed.id,
    };
    const campaign_user_2 = {
        campaign_id: campaign_2.id,
        user_id: manager_user_seed.id,
        access_level: 3,
    };


    const random_user_witout_any_campaigns = {
        id: 701,
        password: 'ShouldHaveLettersDigitsAndAtLeast8chars1',
        email: 'nevermind@random.com',
    };


    before(async () => {
        await DataSeeder.truncateAll();
        await DataSeeder.createUserHashPassword(manager_user_seed);
        await DataSeeder.createUserHashPassword(random_user_witout_any_campaigns);

        await DataSeeder.create('CampaignRepository', campaign_1);
        await DataSeeder.create('CampaignUserRepository', campaign_user_1);

        await DataSeeder.create('CampaignRepository', campaign_2);
        await DataSeeder.create('CampaignUserRepository', campaign_user_2);
    });

    describe('Sort by title', () => {

        it('Should be able to sort ASC', async () => {
            await superApp
                .get('/api/v1/campaigns')
                .query(qs.stringify({
                    sort_list: [
                        'title',
                    ],
                }))
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    expect(response).to.have.property('body');
                    expect(response.body).to.have.property('campaign_list');
                    const [
                        campaign_first,
                        campaign_second,
                    ] = response.body.campaign_list;

                    expect(campaign_first).to.have.property('title', campaign_1.title);
                    expect(campaign_second).to.have.property('title', campaign_2.title);
                });
        });

        it('Should be able to sort DESC', async () => {
            await superApp
                .get('/api/v1/campaigns')
                .query(qs.stringify({
                    sort_list: [
                        '-title',
                    ],
                }))
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    expect(response).to.have.property('body');
                    expect(response.body).to.have.property('campaign_list');
                    const [
                        campaign_first,
                        campaign_second,
                    ] = response.body.campaign_list;

                    expect(campaign_first).to.have.property('title', campaign_2.title);
                    expect(campaign_second).to.have.property('title', campaign_1.title);
                });
        });
    });

    describe('Sort by start_date', () => {

        it('Should be able to sort ASC', async () => {
            await superApp
                .get('/api/v1/campaigns')
                .query(qs.stringify({
                    sort_list: [
                        'start_date',
                    ],
                }))
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    expect(response).to.have.property('body');
                    expect(response.body).to.have.property('campaign_list');
                    const [
                        campaign_first,
                        campaign_second,
                    ] = response.body.campaign_list;

                    expect(campaign_first).to.have.property('title', campaign_1.title);
                    expect(campaign_second).to.have.property('title', campaign_2.title);
                });
        });

        it('Should be able to sort DESC', async () => {
            await superApp
                .get('/api/v1/campaigns')
                .query(qs.stringify({
                    sort_list: [
                        '-start_date',
                    ],
                }))
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    expect(response).to.have.property('body');
                    expect(response.body).to.have.property('campaign_list');
                    const [
                        campaign_first,
                        campaign_second,
                    ] = response.body.campaign_list;

                    expect(campaign_first).to.have.property('title', campaign_2.title);
                    expect(campaign_second).to.have.property('title', campaign_1.title);
                });
        });
    });


    describe('Search on campaign with no campaigs', () => {

        it('Should be able to sort ASC', async () => {
            await superApp
                .get('/api/v1/campaigns')
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(random_user_witout_any_campaigns)}`)
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    expect(response.body.campaign_list).to.be.an('Array');
                    expect(response.body.campaign_list.length).to.equal(0);
                });
        });
    });
});
