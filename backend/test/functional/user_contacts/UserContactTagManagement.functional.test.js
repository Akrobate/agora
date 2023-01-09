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
    contact_1_user_seed,
    contact_2_user_seed,
    contact_3_user_seed,
    contact_4_user_seed,
} = require('../../test_seeds/test_data_seeds');

const superApp = superTest(app);

describe.only('User Contact Management', () => {

    beforeEach(async () => {
        await DataSeeder.truncateAll();

        await DataSeeder.create('UserRepository', contact_1_user_seed);
        await DataSeeder.create('UserRepository', contact_2_user_seed);
        await DataSeeder.create('UserRepository', contact_3_user_seed);
        await DataSeeder.create('UserRepository', contact_4_user_seed);

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

        // contact_3_user_seed.id,
        // contact_4_user_seed.id,


    });


    describe('Create content in user tag', () => {
        it.skip('Should be able to add a user contact', async () => {
            const content_to_create = {
                tag_id: manager_seed_contact_tag_1.id,
                user_id: manager_user_seed.id,
                contact_id_list: [
                    contact_1_user_seed.id,
                    contact_2_user_seed.id,

                ],
            };

            await superApp
                .patch(`${url_prefix}/contacts`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .send(content_to_create)
                .expect(HTTP_CODE.CREATED)
                .expect((response) => {
                    expect(response).to.have.property('body');
                });
        });

        it('Should be able to replace user contact', async () => {
            const content_to_create = {
                tag_id: manager_seed_contact_tag_1.id,
                user_id: manager_user_seed.id,
                contact_id_list: [
                    contact_1_user_seed.id,
                    contact_2_user_seed.id,
                ],
            };

            await superApp
                .post(`${url_prefix}/contacts`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .send(content_to_create)
                .expect(HTTP_CODE.CREATED)
                .expect((response) => {
                    expect(response).to.have.property('body');
                });
        });
    });

});
