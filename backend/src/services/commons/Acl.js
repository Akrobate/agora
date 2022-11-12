'use strict';

const {
    CampaignRepository,
    PropositionRepository,
    CampaignUserRepository,
    UserPropositionResultRepository,
} = require('../../repositories');

const {
    CustomError,
} = require('../../CustomError');


class Acl {

    /**
     * Constructor.
     * @param {UserPropositionResultRepository} user_proposition_result_repository
     * @param {PropositionRepository} proposition_repository
     * @param {CampaignRepository} campaign_repository
     * @param {CampaignUserRepository} campaign_user_repository
     */
    constructor(
        user_proposition_result_repository,
        proposition_repository,
        campaign_repository,
        campaign_user_repository
    ) {
        this.user_proposition_result_repository = user_proposition_result_repository;
        this.proposition_repository = proposition_repository;
        this.campaign_repository = campaign_repository;
        this.campaign_user_repository = campaign_user_repository;
    }


    /* istanbul ignore next */
    /**
     * @static
     * @returns {Acl}
     */
    static getInstance() {
        if (Acl.instance === null) {
            Acl.instance = new Acl(
                UserPropositionResultRepository.getInstance(),
                PropositionRepository.getInstance(),
                CampaignRepository.getInstance(),
                CampaignUserRepository.getInstance()
            );
        }
        return Acl.instance;
    }


    /**
     * @param {Object} jwt_user_data
     * @returns {Void}
     * @throws {CustomError}
     */
    forbidGuestAccessType(jwt_user_data) {
        if (jwt_user_data.access_type === 'guest') {
            throw new CustomError(CustomError.UNAUTHORIZED, 'Guest user is forbiden');
        }
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
            throw new CustomError(CustomError.UNAUTHORIZED, 'User must be a campaign manager');
        }
        return manager_campaign_user;
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
            throw new CustomError(CustomError.UNAUTHORIZED, 'User must be a campaign member');
        }
        return manager_campaign_user;
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
     * @param {Number} campaign_id
     * @returns {Object|Error}
     */
    async checkCampaignStatusIsInProgress(campaign_id) {
        await this.checkCampaignStatus(
            campaign_id,
            CampaignRepository.STATUS_IN_PROGRESS,
            'Campaign must be in progress'
        );
    }


    /**
     * @param {Number} campaign_id
     * @param {Number} status_id
     * @param {String} message
     * @returns {Void}
     */
    async checkCampaignStatus(campaign_id, status_id, message) {
        const campaign = await this.campaign_repository.read(campaign_id);
        if (campaign.campaign_status !== status_id) {
            throw new CustomError(CustomError.UNAUTHORIZED, message);
        }
    }


    /**
     * @param {Object} jwt_user_id
     * @param {Number} user_id
     * @returns {Object|Error}
     */
    checkUserModifiesOwnData(jwt_user_id, user_id) {
        if (jwt_user_id !== user_id) {
            throw new CustomError(CustomError.UNAUTHORIZED, 'User can only modify own data');
        }
    }

}

Acl.instance = null;

module.exports = {
    Acl,
};
