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

describe('CampaignAccess', () => {

    const user_seed = {
        id: 100,
        password: 'ShouldHaveLettersDigitsAndAtLeast8chars1',
        email: 'artiom.fedorov@test.com',
    };

    before(async () => {

        await DataSeeder.truncate('CampaignRepository');
        await DataSeeder.truncate('UserRepository');
        await DataSeeder.createUserHashPassword(user_seed);

    });


    it('Should be able to create a campaign', async () => {
        await superApp
            .post('/api/v1/campaigns')
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(user_seed)}`)
            .send({
                title: 'Title of campaign',
                description: 'Something',
                campaign_status: 2,
            })
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {
                expect(response.body).to.have.property('id');
            });
    });


    it('Should not be able to create a campaign without jwt', async () => {
        await superApp
            .post('/api/v1/campaigns')
            .set('Authorization', `Bearer ${'BAD JWT StrING'}`)
            .send({
                title: 'Title of campaign',
                description: 'Something',
                campaign_status: 2,
            })
            .expect(HTTP_CODE.UNAUTHORIZED)
            .expect((response) => {
                expect(response.body).to.have.property('message');
            });
    });


    it('Should be able to update a just created campaign', async () => {
        const campaign_create_data = {
            title: 'Title of campaign',
            description: 'Something',
            campaign_status: 2,
        };

        let campaign_id = null;
        await superApp
            .post('/api/v1/campaigns')
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(user_seed)}`)
            .send(campaign_create_data)
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {
                campaign_id = response.body.id;
            });

        await superApp
            .patch(`/api/v1/campaigns/${campaign_id}`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(user_seed)}`)
            .send({
                title: 'Title of campaign Updated',
            })
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {
                expect(response.body).to.have.property('id', campaign_id);
                expect(response.body).to.have.property('description', campaign_create_data.description);
                expect(response.body).to.have.property('campaign_status', campaign_create_data.campaign_status);
                expect(response.body).to.have.property('title', 'Title of campaign Updated');
            });


    });

});
