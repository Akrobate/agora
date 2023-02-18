'use strict';

const superTest = require('supertest');
const HTTP_CODE = require('http-status');
const qs = require('qs');

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

describe('User Contact Management', () => {

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

        await DataSeeder.create('UserContactTagRepository', {
            user_id: manager_user_seed.id,
            contact_user_id: contact_3_user_seed.id,
            tag_id: manager_seed_contact_tag_1.id,
        });

        await DataSeeder.create('UserContactTagRepository', {
            user_id: manager_user_seed.id,
            contact_user_id: contact_4_user_seed.id,
            tag_id: manager_seed_contact_tag_1.id,
        });

    });


    describe('Read content in user tag', () => {
        const content_to_read = {
            tag_id_list: [
                manager_seed_contact_tag_1.id,
            ],
            user_id: manager_user_seed.id,
        };

        it('Should be able to read a user contact', async () => {
            await superApp
                .get(`${url_prefix}/contacts`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .query(qs.stringify(content_to_read))
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    expect(response).to.have.property('body');
                    expect(response.body).to.have.property('user_contact_list');
                    const {
                        user_contact_list,
                    } = response.body;

                    expect(user_contact_list.map((item) => item.contact_user_id))
                        .to.includes(contact_3_user_seed.id);
                    expect(user_contact_list.map((item) => item.contact_user_id))
                        .to.includes(contact_4_user_seed.id);
                    expect(user_contact_list.length).to.equal(2);

                });
        });

        it('Should not be able to read content of an other user', async () => {
            await superApp
                .get(`${url_prefix}/contacts`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_2_seed)}`)
                .query(qs.stringify(content_to_read))
                .expect(HTTP_CODE.UNAUTHORIZED);
        });
    });


    describe('Create content in user tag', () => {
        const content_to_create = {
            tag_id: manager_seed_contact_tag_1.id,
            user_id: manager_user_seed.id,
            contact_id_list: [
                contact_1_user_seed.id,
                contact_2_user_seed.id,
            ],
        };

        it('Should be able to add a user contact', async () => {

            await superApp
                .patch(`${url_prefix}/contacts`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .send(content_to_create)
                .expect(HTTP_CODE.CREATED)
                .expect((response) => {
                    expect(response).to.have.property('body');
                    const {
                        body,
                    } = response;

                    expect(body).to.have.property('tag_id', content_to_create.tag_id);
                    expect(body).to.have.property('user_id', content_to_create.user_id);
                    expect(body).to.have.property('contact_user_list');

                    const {
                        contact_user_list,
                    } = body;

                    expect(contact_user_list).to.be.an('Array');

                    const tag_contact_user_id_list = contact_user_list
                        .map((item) => item.contact_user_id);

                    expect(tag_contact_user_id_list).to.includes(contact_1_user_seed.id);
                    expect(tag_contact_user_id_list).to.includes(contact_2_user_seed.id);

                    expect(contact_user_list).to.have.lengthOf(4);

                });

            await superApp
                .get(`${url_prefix}/contacts`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .query(qs.stringify({
                    tag_id_list: [
                        manager_seed_contact_tag_1.id,
                    ],
                    user_id: manager_user_seed.id,
                }))
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    expect(response).to.have.property('body');
                    expect(response.body).to.have.property('user_contact_list');
                    const {
                        user_contact_list,
                    } = response.body;
                    expect(user_contact_list.map((item) => item.contact_user_id))
                        .to.includes(contact_1_user_seed.id);
                    expect(user_contact_list.map((item) => item.contact_user_id))
                        .to.includes(contact_2_user_seed.id);
                    expect(user_contact_list.map((item) => item.contact_user_id))
                        .to.includes(contact_3_user_seed.id);
                    expect(user_contact_list.map((item) => item.contact_user_id))
                        .to.includes(contact_4_user_seed.id);
                    expect(user_contact_list.length).to.equal(4);
                });
        });


        it('Should not be able to add a user contact of an other user', async () => {
            await superApp
                .patch(`${url_prefix}/contacts`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_2_seed)}`)
                .send(content_to_create)
                .expect(HTTP_CODE.UNAUTHORIZED);
        });

        it('Should not be able to add a user contact on tag_id that belongs to another user', async () => {
            await superApp
                .patch(`${url_prefix}/contacts`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .send({
                    ...content_to_create,
                    tag_id: manager_seed_2_contact_tag_1.id,
                })
                .expect(HTTP_CODE.UNAUTHORIZED);
        });


        it('Should be able to replace user contact', async () => {

            await superApp
                .post(`${url_prefix}/contacts`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .send(content_to_create)
                .expect(HTTP_CODE.CREATED)
                .expect((response) => {
                    expect(response).to.have.property('body');
                    const {
                        body,
                    } = response;

                    expect(body).to.have.property('tag_id', content_to_create.tag_id);
                    expect(body).to.have.property('user_id', content_to_create.user_id);
                    expect(body).to.have.property('contact_user_list');

                    const {
                        contact_user_list,
                    } = body;

                    expect(contact_user_list).to.be.an('Array');

                    const tag_contact_user_id_list = contact_user_list
                        .map((item) => item.contact_user_id);
                    expect(tag_contact_user_id_list).to.includes(contact_1_user_seed.id);
                    expect(tag_contact_user_id_list).to.includes(contact_2_user_seed.id);

                    expect(contact_user_list).to.have.lengthOf(2);

                });

            await superApp
                .get(`${url_prefix}/contacts`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .query(qs.stringify({
                    tag_id_list: [
                        manager_seed_contact_tag_1.id,
                    ],
                    user_id: manager_user_seed.id,
                }))
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    expect(response).to.have.property('body');
                    expect(response.body).to.have.property('user_contact_list');
                    const {
                        user_contact_list,
                    } = response.body;
                    expect(user_contact_list.map((item) => item.contact_user_id))
                        .to.includes(contact_1_user_seed.id);
                    expect(user_contact_list.map((item) => item.contact_user_id))
                        .to.includes(contact_2_user_seed.id);

                    expect(user_contact_list.length).to.equal(2);
                });

        });


        it('Should not be able to replace user contact of an other user', async () => {
            await superApp
                .post(`${url_prefix}/contacts`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_2_seed)}`)
                .send(content_to_create)
                .expect(HTTP_CODE.UNAUTHORIZED);
        });


        it('Should not be able to replace a user contact on tag_id that belongs to another user', async () => {
            await superApp
                .post(`${url_prefix}/contacts`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .send({
                    ...content_to_create,
                    tag_id: manager_seed_2_contact_tag_1.id,
                })
                .expect(HTTP_CODE.UNAUTHORIZED);
        });
    });

    describe('Delete content in user tag', () => {

        const content_to_delete = {
            tag_id: manager_seed_contact_tag_1.id,
            user_id: manager_user_seed.id,
            contact_id_list: [
                contact_3_user_seed.id,
                contact_4_user_seed.id,
            ],
        };

        it('Should be able to delete user contacts', async () => {

            await superApp
                .delete(`${url_prefix}/contacts`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .send(content_to_delete)
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    expect(response).to.have.property('body');
                });

            await superApp
                .get(`${url_prefix}/contacts`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .query(qs.stringify({
                    tag_id_list: [
                        manager_seed_contact_tag_1.id,
                    ],
                    user_id: manager_user_seed.id,
                }))
                .expect(HTTP_CODE.OK)
                .expect((response) => {
                    expect(response).to.have.property('body');
                    expect(response.body).to.have.property('user_contact_list');
                    const {
                        user_contact_list,
                    } = response.body;
                    expect(user_contact_list.length).to.equal(0);
                });
        });

        it('Should not be able to delete user contacts of an other user', async () => {

            await superApp
                .delete(`${url_prefix}/contacts`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_2_seed)}`)
                .send(content_to_delete)
                .expect(HTTP_CODE.UNAUTHORIZED);
        });

        it('Should not be able to delete user contacts on tag_id that belongs to another user', async () => {
            await superApp
                .delete(`${url_prefix}/contacts`)
                .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
                .send({
                    ...content_to_delete,
                    tag_id: manager_seed_2_contact_tag_1.id,
                })
                .expect(HTTP_CODE.UNAUTHORIZED);
        });

    });
});
