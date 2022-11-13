'use strict';

const {
    expect,
} = require('chai');
const {
    mock,
} = require('sinon');

const {
    Acl,
} = require('../../../src/services/commons');
const {
    CampaignRepository,
} = require('../../../src/repositories');

describe('Acl unit test', () => {

    const mocks = {};
    const acl = Acl.getInstance();

    beforeEach(() => {
        mocks.campaign_repository = mock(CampaignRepository.getInstance());
    });

    afterEach(() => {
        mocks.campaign_repository.restore();
    });


    it('calculateWinProbability', () => {
        const campaign_id = 10;
        const status_id = 1;
        const message = 'my error message';
        mocks.campaign_repository.expects('read').resolves({
            status_id: status_id + 1,
        });
        try {
            acl.checkCampaignStatus(campaign_id, status_id, message);
        } catch (error) {
            mocks.campaign_repository.verify();
            expect(error).to.have.property('message', message);
        }
    });


});
