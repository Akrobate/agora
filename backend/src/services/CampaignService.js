'use strict';

const {
    CampaignRepository,
    CampaignUserRepository,
    PropositionRepository,
} = require('../repositories');

const {
    Acl,
} = require('./commons');


class CampaignService {

    /**
     * Constructor.
     * @param {Acl} acl
     * @param {CampaignRepository} campaign_repository
     * @param {CampaignUserRepository} campaign_user_repository
     * @param {PropositionRepository} proposition_repository
     */
    constructor(
        acl,
        campaign_repository,
        campaign_user_repository,
        proposition_repository
    ) {
        this.acl = acl;
        this.campaign_repository = campaign_repository;
        this.campaign_user_repository = campaign_user_repository;
        this.proposition_repository = proposition_repository;
    }


    /* istanbul ignore next */
    /**
     * @static
     * @returns {CampaignService}
     */
    static getInstance() {
        if (CampaignService.instance === null) {
            CampaignService.instance = new CampaignService(
                Acl.getInstance(),
                CampaignRepository.getInstance(),
                CampaignUserRepository.getInstance(),
                PropositionRepository.getInstance()
            );
        }
        return CampaignService.instance;
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
        } = input;

        await this.acl.checkUserIsACampaignMember(user_id, campaign_id);

        const campain_user = await this.campaign_user_repository
            .find({
                user_id: user.user_id,
                campaign_id,
            });

        const campaign = await this.campaign_repository.find({
            id: campaign_id,
        });

        return Object.assign(
            {},
            campaign,
            {
                user_access_level: campain_user.access_level,
                user_is_participant: campain_user.is_participant,
            }
        );
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async create(user, input) {

        this.acl.forbidGuestAccessType(user);

        const campaign = await this.campaign_repository
            .create(Object.assign(
                {},
                input,
                {
                    owner_user_id: user.user_id,
                }
            ));

        await this.campaign_user_repository
            .create({
                campaign_id: campaign.id,
                user_id: user.user_id,
                access_level: CampaignUserRepository.MANAGER,
            });

        return campaign;
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
            id: campaign_id,
        } = input;

        this.acl.forbidGuestAccessType(user);
        this.acl.checkUserIsCampaignManager(user_id, campaign_id);

        await this.campaign_repository
            .update(input);

        return this.campaign_repository.find({
            id: campaign_id,
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
            id: campaign_id,
        } = input;
        this.acl.forbidGuestAccessType(user);
        this.acl.checkUserIsCampaignManager(user_id, campaign_id);

        await this.campaign_repository
            .delete(campaign_id);

        const campaign_user_list = await this.campaign_user_repository
            .search({
                campaign_id,
            });
        await Promise.all(
            campaign_user_list
                .map(
                    (campaign_user) => this.campaign_user_repository
                        .delete(campaign_user.id)
                )
        );

        const proposition_list = await this.proposition_repository
            .search({
                campaign_id,
            });
        await Promise.all(
            proposition_list
                .map(
                    (proposition) => this.proposition_repository
                        .delete(proposition.id)
                )
        );

        // @todo add remove related items

        return null;
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async search(user, input) {

        const campain_user_list = await this.campaign_user_repository
            .search({
                user_id: user.user_id,
            });

        if (campain_user_list.length === 0) {
            return [];
        }

        const campaign_list = await this.campaign_repository
            .search(Object.assign(
                {},
                input,
                {
                    id_list: campain_user_list.map((campaign_user) => campaign_user.campaign_id),
                }
            ));


        return campaign_list.map((campaign) => {
            const campaign_user = campain_user_list
                .find((_campaign_user) => _campaign_user.campaign_id === campaign.id);

            return Object.assign(
                {},
                campaign,
                {
                    user_access_level: campaign_user.access_level,
                    user_is_participant: campaign_user.is_participant,
                }
            );
        });
    }

}

CampaignService.instance = null;

module.exports = {
    CampaignService,
};
