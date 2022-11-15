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
} = require('../test_helpers/DataSeeder');

const {
    manager_user_seed,
    campaign_seed,
    manager_campaign_user_seed,
    guest_user_seed,
    guest_campaign_user_seed,
} = require('../test_seeds/test_data_seeds');


const superApp = superTest(app);

describe('InvitationCampaignUser', () => {

    const mocks = {};

    beforeEach(async () => {

        await DataSeeder.truncate('CampaignRepository');
        await DataSeeder.truncate('CampaignUserRepository');
        await DataSeeder.truncate('CampaignUserStatusRepository');
        await DataSeeder.truncate('UserRepository');

        await DataSeeder.createUserHashPassword(manager_user_seed);
        await DataSeeder.create('UserRepository', guest_user_seed);

        mocks.service_email = mock(EmailService.getInstance());

    });

    afterEach(() => {
        mocks.service_email.restore();
    });

    it('Manager should be able invite a guest', async () => {

        await DataSeeder.create('CampaignRepository', campaign_seed);
        await DataSeeder.create('CampaignUserRepository', manager_campaign_user_seed);
        await DataSeeder.create('CampaignUserRepository', guest_campaign_user_seed);

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

                mocks.service_email.verify();

            });
    });


    it('Manager should not be able to invite somebody on a draft campaign', async () => {

        await DataSeeder.create('CampaignRepository', {
            ...campaign_seed,
            campaign_status: 1,
        });
        await DataSeeder.create('CampaignUserRepository', manager_campaign_user_seed);
        await DataSeeder.create('CampaignUserRepository', guest_campaign_user_seed);

        mocks.service_email
            .expects('sendInvitationMail')
            .never();

        await superApp
            .post(`/api/v1/campaigns/${campaign_seed.id}/users/${guest_campaign_user_seed.id}/invite`)
            .set('Authorization', `Bearer ${DataSeeder.getJwtFullAccessToken(manager_user_seed)}`)
            .expect(HTTP_CODE.UNAUTHORIZED)
            .expect((response) => {
                expect(response.body).to.have.property('message', 'Cannot invite on draft campaigns');
                mocks.service_email.verify();
            });
    });
});
