'use strict';

const {
    Acl,
} = require('./commons');

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
     * @param {Acl} acl
     * @param {PropositionRepository} proposition_repository
     * @param {CampaignRepository} campaign_repository
     * @param {CampaignUserRepository} campaign_user_repository
     */
    constructor(
        acl,
        proposition_repository,
        campaign_repository,
        campaign_user_repository
    ) {
        this.acl = acl;
        this.proposition_repository = proposition_repository;
        this.campaign_repository = campaign_repository;
        this.campaign_user_repository = campaign_user_repository;
    }


    /* istanbul ignore next */
    /**
     * @static
     * @returns {PropositionService}
     */
    static getInstance() {
        if (PropositionService.instance === null) {
            PropositionService.instance = new PropositionService(
                Acl.getInstance(),
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

        await this.acl.checkUserIsACampaignMember(user_id, campaign_id);
        return this.proposition_repository.read(proposition_id);
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

        this.acl.forbidGuestAccessType(user);

        await this.acl.checkUserIsCampaignManager(user_id, campaign_id);

        return this.proposition_repository.create({
            campaign_id,
            creator_user_id: user_id,
            payload,
        });
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async update(user, input) {
        const {
            user_id,
        } = user;

        const {
            proposition_id,
            campaign_id,
            payload,
        } = input;

        this.acl.forbidGuestAccessType(user);
        await this.acl.checkUserIsCampaignManager(user_id, campaign_id);
        await this.throwErrorIfCampaignStarted(campaign_id);

        return this.proposition_repository.update({
            id: proposition_id,
            payload,
        });
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

        this.acl.forbidGuestAccessType(user);

        const proposition = await this.proposition_repository.read(proposition_id);

        if (Number(campaign_id) !== Number(proposition.campaign_id)) {
            throw new CustomError(CustomError.UNAUTHORIZED, 'Proposition does not belongs to campaign');
        }

        await this.acl.checkUserIsCampaignManager(user_id, proposition.campaign_id);

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

        await this.acl.checkUserIsACampaignMember(user_id, campaign_id);
        return this.proposition_repository.search({
            campaign_id,
        });
    }


    /**
     * @param {*} campaign_id
     * @return {Void|Throw<CustomError>}
     */
    async throwErrorIfCampaignStarted(campaign_id) {
        const [
            campaign,
        ] = await this.campaign_repository
            .search({
                id_list: [
                    campaign_id,
                ],
            });

        if (campaign.campaign_status === CampaignRepository.STATUS_IN_PROGRESS) {
            throw new CustomError(CustomError.BAD_PARAMETER, 'Proposition cannot be modified once campaign started');
        }
    }

}

PropositionService.instance = null;

module.exports = {
    PropositionService,
};
