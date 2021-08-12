'use strict';

const moment = require('moment');

const {
    Acl,
} = require('./commons');

const {
    CampaignRepository,
    CampaignUserRepository,
    UserRepository,
    CampaignUserStatusRepository,
} = require('../repositories');

// const {
//     CustomError,
// } = require('../CustomError');


class CampaignUserStatusService {

    /**
     * Constructor.
     * @param {Acl} acl
     * @param {CampaignRepository} campaign_repository
     * @param {CampaignUserRepository} campaign_user_repository
     * @param {UserRepository} user_repository
     * @param {CampaignUserStatusRepository} campaign_user_status_repository
     */
    constructor(
        acl,
        campaign_repository,
        campaign_user_repository,
        user_repository,
        campaign_user_status_repository
    ) {
        this.acl = acl;
        this.campaign_repository = campaign_repository;
        this.campaign_user_repository = campaign_user_repository;
        this.user_repository = user_repository;
        this.campaign_user_status_repository = campaign_user_status_repository;
    }


    /* istanbul ignore next */
    /**
     * @static
     * @returns {CampaignUserStatusService}
     */
    static getInstance() {
        if (CampaignUserStatusService.instance === null) {
            CampaignUserStatusService.instance = new CampaignUserStatusService(
                Acl.getInstance(),
                CampaignRepository.getInstance(),
                CampaignUserRepository.getInstance(),
                UserRepository.getInstance(),
                CampaignUserStatusRepository.getInstance()
            );
        }
        return CampaignUserStatusService.instance;
    }

    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async updateCampaignStatus(user, input) {
        const {
            user_id,
        } = user;

        const {
            campaign_id,
            status_id,
        } = input;

        await this.acl.checkUserIsACampaignMember(user_id, campaign_id);

        let campaign_user_status = await this.campaign_user_status_repository.find({
            campaign_id,
            user_id,
        });

        if (campaign_user_status === null) {
            campaign_user_status = await this.campaign_user_status_repository.create({
                campaign_id,
                status_id,
                user_id,
                date: moment().toISOString(),
            });
        } else {
            campaign_user_status = await this.campaign_user_status_repository.update({
                id: campaign_user_status.id,
                campaign_id,
                status_id,
                user_id,
                date: moment().toISOString(),
            });
        }

        return campaign_user_status;
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async getCampaignStatus(user, input) {

        const {
            user_id,
        } = user;

        const {
            campaign_id,
        } = input;

        const campaign_user_status = await this.campaign_user_status_repository
            .find({
                campaign_id,
                user_id,
            });

        return campaign_user_status;
    }


    /**
     * @param {String} email
     * @returns {Object}
     */
    async getOrCreateUserToInvite(email) {
        let user_to_add = await this.user_repository.find({
            email,
        });

        if (user_to_add === null) {
            user_to_add = await this.user_repository.create({
                email,
            });
        }

        return user_to_add;
    }

}

CampaignUserStatusService.instance = null;

module.exports = {
    CampaignUserStatusService,
};