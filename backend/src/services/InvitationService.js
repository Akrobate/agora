'use strict';

const moment = require('moment');

const {
    Acl,
} = require('./commons');

const {
    EmailService,
} = require('./EmailService');

const {
    CustomError,
} = require('../CustomError');

const {
    CampaignUserRepository,
    CampaignRepository,
    UserRepository,
    CampaignUserStatusRepository,
} = require('../repositories');

class InvitationService {

    /**
     * Constructor.
     * @param {Acl} acl
     * @param {EmailService} email_service
     * @param {CampaignUserRepository} campaign_user_repository
     * @param {CampaignRepository} campaign_repository
     * @param {CampaignRepository} user_repository
     * @param {CampaignUserStatusRepository} campaign_user_status_repository
     */
    constructor(
        acl,
        email_service,
        campaign_user_repository,
        campaign_repository,
        user_repository,
        campaign_user_status_repository
    ) {
        this.acl = acl;
        this.email_service = email_service;
        this.campaign_user_repository = campaign_user_repository;
        this.campaign_repository = campaign_repository;
        this.user_repository = user_repository;
        this.campaign_user_status_repository = campaign_user_status_repository;
    }


    /* istanbul ignore next */
    /**
     * @static
     * @returns {InvitationService}
     */
    static getInstance() {
        if (InvitationService.instance === null) {
            InvitationService.instance = new InvitationService(
                Acl.getInstance(),
                EmailService.getInstance(),
                CampaignUserRepository.getInstance(),
                CampaignRepository.getInstance(),
                UserRepository.getInstance(),
                CampaignUserStatusRepository.getInstance()
            );
        }
        return InvitationService.instance;
    }


    /**
     * @param {*} user
     * @param {*} input
     * @return {Promise<Object>}
     */
    async sendCampaignUserInvitation(user, input) {
        const {
            id,
            campaign_id,
        } = input;

        await this.acl.checkUserIsCampaignManager(user.user_id, campaign_id);

        const campaign_user = await this.campaign_user_repository.read(id);
        const campaign = await this.campaign_repository.read(campaign_id);
        const user_to_invite = await this.user_repository.read(campaign_user.user_id);

        if (campaign.campaign_status === CampaignRepository.STATUS_DRAFT) {
            throw new CustomError(CustomError.UNAUTHORIZED, 'Cannot invite on draft campaigns');
        }

        const invitation_params = {
            to: user_to_invite.email,
            campaign_name: campaign.title,
            campaign_description: campaign.description,
            invitation_token: campaign_user.public_token,
        };

        await this.email_service.sendInvitationMail(invitation_params);

        const status_upsert_params = {
            campaign_id,
            status_id: CampaignUserStatusRepository.INVITED,
            user_id: campaign_user.user_id,
            date: moment().toISOString(),
        };

        await this.campaign_user_status_repository.upsertCampaignUserStatus(status_upsert_params);

        return status_upsert_params;
    }

}

InvitationService.instance = null;

module.exports = {
    InvitationService,
};
