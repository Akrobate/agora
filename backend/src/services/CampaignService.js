'use strict';

const moment = require('moment');

const {
    CampaignRepository,
    CampaignUserRepository,
    PropositionRepository,
    CampaignUserStatusRepository,
    UserPropositionResultRepository,
    UserPropositionEloResultRepository,
} = require('../repositories');

const {
    CustomError,
} = require('../CustomError');

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
     * @param {CampaignUserStatusRepository} campaign_user_status_repository
     * @param {CampaignUserStatusRepository} user_proposition_result_repository
     * @param {UserPropositionEloResultRepository} user_proposition_elo_result_repository
     */
    constructor(
        acl,
        campaign_repository,
        campaign_user_repository,
        proposition_repository,
        campaign_user_status_repository,
        user_proposition_result_repository,
        user_proposition_elo_result_repository
    ) {
        this.acl = acl;
        this.campaign_repository = campaign_repository;
        this.campaign_user_repository = campaign_user_repository;
        this.proposition_repository = proposition_repository;
        this.campaign_user_status_repository = campaign_user_status_repository;
        this.user_proposition_result_repository = user_proposition_result_repository;
        this.user_proposition_elo_result_repository = user_proposition_elo_result_repository;
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
                PropositionRepository.getInstance(),
                CampaignUserStatusRepository.getInstance(),
                UserPropositionResultRepository.getInstance(),
                UserPropositionEloResultRepository.getInstance()
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
        await this.acl.checkUserIsCampaignManager(user_id, campaign_id);
        await this.checkPropositionTypeCanBeChanged(input);

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
        await this.acl.checkUserIsCampaignManager(user_id, campaign_id);

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

        const campaign_user_status_list = await this.campaign_user_status_repository
            .search({
                campaign_id,
            });
        await Promise.all(
            campaign_user_status_list
                .map(
                    (campaign_user_status) => this.campaign_user_status_repository
                        .delete(campaign_user_status.id)
                )
        );

        const user_proposition_result_list = await this.user_proposition_result_repository
            .search({
                campaign_id,
            });
        await Promise.all(
            user_proposition_result_list
                .map(
                    (user_proposition_result) => this.user_proposition_result_repository
                        .delete(user_proposition_result.id)
                )
        );

        const user_proposition_elo_result_list = await this.user_proposition_elo_result_repository
            .search({
                campaign_id,
            });
        await Promise.all(
            user_proposition_elo_result_list
                .map(
                    (user_proposition_elo_result) => this.user_proposition_elo_result_repository
                        .delete(user_proposition_elo_result.id)
                )
        );

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


    /**
     * @param {Object} input
     * @returns {Void|Throw<Error>}
     */
    async checkPropositionTypeCanBeChanged(input) {

        const proposition_list = await this.proposition_repository.search({
            campaign_id: input.id,
        });

        const campaign_list = await this.campaign_repository.search({
            id_list: [
                input.id,
            ],
        });

        const [
            campaign,
        ] = campaign_list;

        const has_propositions = proposition_list.length > 0;

        const campaign_proposition_type_changed = (
            (input.proposition_type !== undefined)
            && (input.proposition_type !== campaign.proposition_type)
        );

        if (campaign_proposition_type_changed && has_propositions) {
            throw new CustomError(CustomError.BAD_PARAMETER, 'This campaign has allready some setted proposition, proposition type cannot be modified');
        }
    }

    /**
     * @todo plug it in process
     * @param {Object} campaign_id
     * @returns {Void|Throw<Error>}
     */
    async updateCampaignIfFinished(campaign_id) {

        const [
            campaign,
        ] = await this.campaign_repository.search({
            id: campaign_id,
            end_date_upper_boundary: moment().toISOString(),
        });

        if (campaign === undefined) {
            return false;
        }

        await this.campaign_repository.update({
            id: campaign.id,
            campaign_status: CampaignRepository.STATUS_FINISHED,
        });
        return true;
    }
}

CampaignService.instance = null;

module.exports = {
    CampaignService,
};
