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
    CampaignUserStatusRepository,
    UserRepository,
} = require('../repositories');

// const {
//     CustomError,
// } = require('../CustomError');


class CampaignUserService {

    /**
     * Constructor.
     * @param {Acl} acl
     * @param {CampaignRepository} campaign_repository
     * @param {CampaignUserRepository} campaign_user_repository
     * @param {CampaignUserStatusRepository} campaign_user_status_repository
     * @param {UserRepository} user_repository
     */
    constructor(
        acl,
        campaign_repository,
        campaign_user_repository,
        campaign_user_status_repository,
        user_repository
    ) {
        this.acl = acl;
        this.campaign_repository = campaign_repository;
        this.campaign_user_repository = campaign_user_repository;
        this.campaign_user_status_repository = campaign_user_status_repository;
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
                CampaignUserStatusRepository.getInstance(),
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
            is_participant,
        } = input;

        await this.acl.forbidGuestAccessType(user);

        await this.acl.checkCampaignExists(campaign_id);

        await this.acl.checkUserIsCampaignManager(user.user_id, campaign_id);

        const user_to_add = await this.getOrCreateUserToInvite(email);

        const campaign_user = await this.campaign_user_repository
            .create({
                campaign_id,
                user_id: user_to_add.id,
                access_level,
                is_participant,
                public_token: `${v4()}`.replace(/-/g, ''),
            });

        return campaign_user;
    }

    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async updateCampaignUser(user, input) {
        const {
            id,
            access_level,
            is_participant,
            campaign_id,
        } = input;

        await this.acl.forbidGuestAccessType(user);

        await this.acl.checkCampaignExists(campaign_id);

        await this.acl.checkUserIsCampaignManager(user.user_id, campaign_id);

        await this.campaign_user_repository
            .update({
                id,
                access_level,
                is_participant,
            });

        return this.campaign_user_repository.read(id);
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async searchCampaignUsers(user, input) {
        const {
            campaign_id,
            status_id_list,
            is_participant,
        } = input;

        await this.acl.forbidGuestAccessType(user);

        await this.acl.checkCampaignExists(campaign_id);

        await this.acl.checkUserIsCampaignManager(user.user_id, campaign_id);


        const campaign_user_status_list = await this.campaign_user_status_repository.search({
            campaign_id,
        });

        const campaign_user_list = await this.campaign_user_repository.search({
            is_participant,
            campaign_id,
        });

        const user_list = await this.user_repository.search({
            id_list: campaign_user_list.map((campaign_user) => campaign_user.user_id),
        });

        return campaign_user_list
            .filter((campaign_user) => {
                if (status_id_list) {
                    return campaign_user_status_list.find(
                        (_user_status) => status_id_list.includes(_user_status.status_id)
                            && _user_status.user_id === campaign_user.user_id
                    ) !== undefined;
                }
                return true;
            })
            .map((campaign_user) => Object.assign(
                {},
                campaign_user,
                {
                    email: user_list.find((_user) => campaign_user.user_id === _user.id).email,
                    user_status_list: campaign_user_status_list
                        .filter((_user_status) => _user_status.user_id === campaign_user.user_id),
                }
            ));
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async removeCampaignUser(user, input) {
        const {
            campaign_id,
            id,
        } = input;

        await this.acl.forbidGuestAccessType(user);

        await this.acl.checkCampaignExists(campaign_id);

        await this.acl.checkUserIsCampaignManager(user.user_id, campaign_id);

        return this.campaign_user_repository.delete(id);

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
