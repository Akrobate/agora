'use strict';

const superTest = require('supertest');
const HTTP_CODE = require('http-status');

const {
    expect,
} = require('chai');

const url_prefix = '/api/v1';

const {
    app,
} = require('../../../src/app');

const {
    DataSeeder,
} = require('../../test_helpers/DataSeeder');

const {
    manager_user_seed,
    campaign_seed,
    manager_campaign_user_seed,
    guest_user_seed,
    guest_campaign_user_seed,
    manager_user_2_seed,
    manager_campaign_user_2_seed,
} = require('../../test_seeds/test_data_seeds');

const {
    CampaignUserRepository,
} = require('../../../src/repositories');

const superApp = superTest(app);

// @todo implement tags management
describe.only('UserContactTagManagement', () => {

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

    it('Should be able to create a new tag', async () => {

        const tag_to_create = {
            name: 'My new created tag',
            user_id: manager_user_seed.id,
        };

        await superApp
            .post(`${url_prefix}/contacts/tags`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .send(tag_to_create)
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {
                expect(response.body).to.have.property('id');
                expect(response.body).to.have.property('name', tag_to_create.name);
                expect(response.body).to.have.property('user_id', tag_to_create.user_id);
            });
    });

});
