'use strict';

const {
    v4,
} = require('uuid');

const {
    CampaignRepository,
    CampaignUserRepository,
    UserRepository,
} = require('../repositories');

const {
    CustomError,
} = require('../CustomError');


class CampaignUserService {

    /**
     * Constructor.
     * @param {CampaignRepository} campaign_repository
     * @param {CampaignUserRepository} campaign_user_repository
     * @param {UserRepository} user_repository
     */
    constructor(
        campaign_repository,
        campaign_user_repository,
        user_repository
    ) {
        this.campaign_repository = campaign_repository;
        this.campaign_user_repository = campaign_user_repository;
        this.user_repository = user_repository;
    }

    /**
     * @static
     * @returns {CampaignUserService}
     */
    static getInstance() {
        if (CampaignUserService.instance === null) {
            CampaignUserService.instance = new CampaignUserService(
                CampaignRepository.getInstance(),
                CampaignUserRepository.getInstance(),
                UserRepository.getInstance()
            );
        }
        return CampaignUserService.instance;
    }

    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async addUserToCampaign(user, input) {
        const {
            email,
            campaign_id,
            access_level,
        } = input;

        if (user.access_type !== 'full') {
            throw new CustomError(CustomError.UNAUTHORIZED, 'Guest user cannot add create users to campaigns');
        }

        await this.checkCampaignExists(campaign_id);

        await this.checkUserIsCampaignManager(user.user_id, campaign_id);

        const user_to_add = await this.getOrCreateUserToInvite(email);

        const campaign_user = await this.campaign_user_repository
            .create({
                campaign_id,
                user_id: user_to_add.id,
                access_level,
                public_token: `${v4()}`.replace(/-/g, ''),
            });

        return campaign_user;
    }


    /**
     * @param {Number} campaign_id
     * @returns {Object|Error}
     */
    async checkCampaignExists(campaign_id) {
        const campaign = await this.campaign_repository
            .find({
                id_list: [campaign_id],
            });

        if (campaign === null) {
            throw new CustomError(CustomError.UNAUTHORIZED, 'Campaign does not exists');
        }
        return campaign;
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

}

CampaignUserService.instance = null;

module.exports = {
    CampaignUserService,
};
