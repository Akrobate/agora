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
    manager_seed_contact_tag_1,
    manager_seed_contact_tag_2,
    manager_seed_2_contact_tag_1,
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

        await DataSeeder.create('ContactTagRepository', manager_seed_contact_tag_1);
        await DataSeeder.create('ContactTagRepository', manager_seed_contact_tag_2);
        await DataSeeder.create('ContactTagRepository', manager_seed_2_contact_tag_1);

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
                console.log(response.body)
                expect(response.body).to.have.property('id');
                expect(response.body).to.have.property('name', tag_to_create.name);
                expect(response.body).to.have.property('user_id', tag_to_create.user_id);
            });
    });

    // red test
    describe('Search tags', () => {
        it('Should be able to search a tag', () => {
            return superApp
                .get(`${url_prefix}/contacts/tags`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    expect(response).to.have.property('body');
                    expect(response.body).to.have.property('tag_list');
                    expect(response.body.tag_list).to.have.lengthOf(2);

                });
        });

        it('Should be able to search a tag of manager_user_2_seed', () => {
            return superApp
                .get(`${url_prefix}/contacts/tags`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_2_seed)}`)
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    expect(response).to.have.property('body');
                    expect(response.body).to.have.property('tag_list');
                    expect(response.body.tag_list).to.have.lengthOf(1);

                });
        });
    });
});
