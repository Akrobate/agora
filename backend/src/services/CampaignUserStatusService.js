'use strict';

const moment = require('moment');

const {
    CampaignRepository,
    CampaignUserRepository,
    UserRepository,
    CampaignUserStatusRepository,
} = require('../repositories');

const {
    CustomError,
} = require('../CustomError');


class CampaignUserStatusService {

    /**
     * Constructor.
     * @param {CampaignRepository} campaign_repository
     * @param {CampaignUserRepository} campaign_user_repository
     * @param {UserRepository} user_repository
     * @param {CampaignUserStatusRepository} campaign_user_status_repository
     */
    constructor(
        campaign_repository,
        campaign_user_repository,
        user_repository,
        campaign_user_status_repository
    ) {
        this.campaign_repository = campaign_repository;
        this.campaign_user_repository = campaign_user_repository;
        this.user_repository = user_repository;
        this.campaign_user_status_repository = campaign_user_status_repository;
    }

    /**
     * @static
     * @returns {CampaignUserStatusService}
     */
    static getInstance() {
        if (CampaignUserStatusService.instance === null) {
            CampaignUserStatusService.instance = new CampaignUserStatusService(
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

        await this.checkUserIsACampaignMember(user_id, campaign_id);

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
     * @param {Number} user_id
     * @param {Number} campaign_id
     * @returns {Object|Error}
     */
    async checkUserIsCampaignManager(user_id, campaign_id) {
        const manager_campaign_user = await this.campaign_user_repository
            .find({
                campaign_id,
                user_id,
                access_level: CampaignUserRepository.MANAGER,
            });

        if (manager_campaign_user === null) {
            throw new CustomError(CustomError.UNAUTHORIZED, 'User is not allowed to add users to campaigns');
        }
        return manager_campaign_user;
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


    /**
     * @param {Number} user_id
     * @param {Number} campaign_id
     * @returns {Object|Error}
     */
    async checkUserIsACampaignMember(user_id, campaign_id) {
        const manager_campaign_user = await this.campaign_user_repository
            .find({
                campaign_id,
                user_id,
            });

        if (manager_campaign_user === null) {
            throw new CustomError(CustomError.UNAUTHORIZED, 'User is not allowed change status');
        }
        return manager_campaign_user;
    }

}

CampaignUserStatusService.instance = null;

module.exports = {
    CampaignUserStatusService,
};
