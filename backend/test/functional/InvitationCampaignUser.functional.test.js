'use strict';

const superTest = require('supertest');
const HTTP_CODE = require('http-status');

const {
    expect,
} = require('chai');

const {
    mock,
} = require('sinon');

const {
    app,
} = require('../../src/app');

const {
    EmailService,
} = require('../../src/services');

const {
    DataSeeder,
} = require('../helpers/DataSeeder');

const superApp = superTest(app);

describe('InvitationCampaignUser', () => {

    const manager_user_seed = {
        id: 100,
        password: 'ShouldHaveLettersDigitsAndAtLeast8chars1',
        email: 'manager.user@test.com',
    };

    const campaign_seed = {
        id: 10,
        title: 'Title of campaignsss',
        description: 'Somethings',
        campaign_status: 2,
        owner_user_id: manager_user_seed.id,
    };

    const manager_campaign_user_seed = {
        id: 100,
        campaign_id: campaign_seed.id,
        user_id: 100,
        access_level: 3,
    };

    const guest_user_seed = {
        id: 200,
        email: 'fedorov.artiom@gmail.com',
    };

    const guest_campaign_user_seed = {
        id: 200,
        campaign_id: campaign_seed.id,
        user_id: guest_user_seed.id,
        public_token: '8185933f78c749b381ad630308cd1257',
        access_level: 1,
    };

    const mocks = {};

    before(async () => {

        await DataSeeder.truncate('CampaignRepository');
        await DataSeeder.truncate('CampaignUserRepository');
        await DataSeeder.truncate('CampaignUserStatusRepository');
        await DataSeeder.truncate('UserRepository');

        await DataSeeder.createUserHashPassword(manager_user_seed);
        await DataSeeder.create('CampaignRepository', campaign_seed);
        await DataSeeder.create('CampaignUserRepository', manager_campaign_user_seed);

        await DataSeeder.create('UserRepository', guest_user_seed);
        await DataSeeder.create('CampaignUserRepository', guest_campaign_user_seed);

        mocks.service_email = mock(EmailService.getInstance());

    });

    after(() => {
        mocks.service_email.restore();
    });

    it('Manager should be able invite a guest', async () => {

        mocks.service_email
            .expects('sendInvitationMail')
            .withArgs({
                to: guest_user_seed.email,
                campaign_name: 'Title of campaignsss',
                campaign_description: 'Somethings',
                invitation_token: '8185933f78c749b381ad630308cd1257',
            })
            .returns(Promise.resolve({}));

        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/users/${guest_campaign_user_seed.id}/invite`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {
                // console.log(response.body);
                expect(response.body).to.have.property('campaign_id');
                expect(response.body).to.have.property('status_id');
                expect(response.body).to.have.property('user_id');
                expect(response.body).to.have.property('date');
            });
    });
});
