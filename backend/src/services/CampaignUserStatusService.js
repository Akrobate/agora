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

        const campaign_user_status = await this.campaign_user_status_repository
            .upsertCampaignUserStatus({
                campaign_id,
                status_id,
                user_id,
                date: moment().toISOString(),
            });

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
            status_id,
        } = input;

        const campaign_user_status = await this.campaign_user_status_repository
            .search({
                campaign_id,
                user_id,
                status_id,
            });

        return campaign_user_status;
    }

}

CampaignUserStatusService.instance = null;

module.exports = {
    CampaignUserStatusService,
};
