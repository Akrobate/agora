'use strict';

const {
    CampaignRepository,
    PropositionRepository,
    CampaignUserRepository,
} = require('../repositories');

const {
    CustomError,
} = require('../CustomError');


class PropositionService {

    /**
     * Constructor.
     * @param {PropositionRepository} proposition_repository
     * @param {CampaignRepository} campaign_repository
     * @param {CampaignUserRepository} campaign_user_repository
     */
    constructor(
        proposition_repository,
        campaign_repository,
        campaign_user_repository
    ) {
        this.proposition_repository = proposition_repository;
        this.campaign_repository = campaign_repository;
        this.campaign_user_repository = campaign_user_repository;
    }

    /**
     * @static
     * @returns {PropositionService}
     */
    static getInstance() {
        if (PropositionService.instance === null) {
            PropositionService.instance = new PropositionService(
                PropositionRepository.getInstance(),
                CampaignRepository.getInstance(),
                CampaignUserRepository.getInstance()
            );
        }
        return PropositionService.instance;
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async read(user, input) {
        const {
            user_id,
        } = user;

        const {
            campaign_id,
            proposition_id,
        } = input;

        await this.checkUserIsACampaignMember(user_id, campaign_id);
        const proposition = this.proposition_repository.read(proposition_id);
        return proposition;

    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async create(user, input) {
        const {
            user_id,
        } = user;

        const {
            campaign_id,
            payload,
        } = input;

        if (user.access_type === 'guest') {
            throw new CustomError(CustomError.UNAUTHORIZED, 'Guest user add propositions');
        }

        await this.checkUserIsCampaignManager(user_id, campaign_id);

        const proposition = await this.proposition_repository.create({
            campaign_id,
            creator_user_id: user_id,
            payload,
        });

        return proposition;
    }

    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async delete(user, input) {
        const {
            user_id,
        } = user;

        const {
            proposition_id,
            campaign_id,
        } = input;

        if (user.access_type === 'guest') {
            throw new CustomError(CustomError.UNAUTHORIZED, 'Guest user cannot delete campaigns');
        }

        const proposition = await this.proposition_repository.read(proposition_id);

        if (Number(campaign_id) !== Number(proposition.campaign_id)) {
            throw new CustomError(CustomError.UNAUTHORIZED, 'Proposition does not belongs to campaign');
        }

        await this.checkUserIsCampaignManager(user_id, proposition.campaign_id);

        return this.proposition_repository.delete(proposition_id);
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async search(user, input) {
        const {
            user_id,
        } = user;

        const {
            campaign_id,
        } = input;

        await this.checkUserIsACampaignMember(user_id, campaign_id);
        const proposition_list = await this.proposition_repository.search({
            campaign_id,
        });

        return proposition_list;
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
            throw new CustomError(CustomError.UNAUTHORIZED, 'User is not allowed to add propositions');
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
            throw new CustomError(CustomError.UNAUTHORIZED, 'User is not allowed to read propositions');
        }
        return manager_campaign_user;
    }

}

PropositionService.instance = null;

module.exports = {
    PropositionService,
};
