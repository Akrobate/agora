'use strict';

const {
    v4,
} = require('uuid');

const {
    Acl,
} = require('../services/commons');

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
     * @param {Acl} acl
     * @param {CampaignRepository} campaign_repository
     * @param {CampaignUserRepository} campaign_user_repository
     * @param {UserRepository} user_repository
     */
    constructor(
        acl,
        campaign_repository,
        campaign_user_repository,
        user_repository
    ) {
        this.acl = acl;
        this.campaign_repository = campaign_repository;
        this.campaign_user_repository = campaign_user_repository;
        this.user_repository = user_repository;
    }


    /* istanbul ignore next */
    /**
     * @static
     * @returns {CampaignUserService}
     */
    static getInstance() {
        if (CampaignUserService.instance === null) {
            CampaignUserService.instance = new CampaignUserService(
                Acl.getInstance(),
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

        await this.acl.checkCampaignExists(campaign_id);

        await this.acl.checkUserIsCampaignManager(user.user_id, campaign_id);

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
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async searchCampaignUsers(user, input) {
        const {
            campaign_id,
        } = input;

        await this.acl.forbidGuestAccessType(user);

        await this.acl.checkCampaignExists(campaign_id);

        await this.acl.checkUserIsCampaignManager(user.user_id, campaign_id);

        const campaign_user_list = await this.campaign_user_repository.search({
            campaign_id,
        });

        const user_list = await this.user_repository.search({
            id_list: campaign_user_list.map((campaign_user) => campaign_user.user_id),
        });

        return campaign_user_list.map((campaign_user) => Object.assign(
            {},
            campaign_user,
            {
                email: user_list.find((_user) => campaign_user.user_id === _user.id).email,
            }
        ));
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
