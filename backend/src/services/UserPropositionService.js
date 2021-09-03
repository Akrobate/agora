'use strict';

const {
    Acl,
} = require('./commons');

const {
    CampaignRepository,
    PropositionRepository,
    CampaignUserRepository,
    UserPropositionResultRepository,
    CampaignUserStatusRepository,
} = require('../repositories');

const {
    BordaAlgorithm,
    RelativeMajorityAlgorithm,
} = require('../services/voting_algorithms');

class UserPropositionService {

    /**
     * @param {Acl} acl
     * @param {UserPropositionResultRepository} user_proposition_result_repository
     * @param {PropositionRepository} proposition_repository
     * @param {CampaignRepository} campaign_repository
     * @param {CampaignUserRepository} campaign_user_repository
     * @param {CampaignUserStatusRepository} campaign_user_status_repository
     * @param {BordaAlgorithm} borda_algorithm
     * @param {RelativeMajorityAlgorithm} relative_majority_algorithm
     */
    constructor(
        acl,
        user_proposition_result_repository,
        proposition_repository,
        campaign_repository,
        campaign_user_repository,
        campaign_user_status_repository,
        borda_algorithm,
        relative_majority_algorithm
    ) {
        this.acl = acl;
        this.user_proposition_result_repository = user_proposition_result_repository;
        this.proposition_repository = proposition_repository;
        this.campaign_repository = campaign_repository;
        this.campaign_user_repository = campaign_user_repository;
        this.campaign_user_status_repository = campaign_user_status_repository;

        this.borda_algorithm = borda_algorithm;
        this.relative_majority_algorithm = relative_majority_algorithm;
    }


    /* istanbul ignore next */
    /**
     * @static
     * @returns {UserPropositionService}
     */
    static getInstance() {
        if (UserPropositionService.instance === null) {
            UserPropositionService.instance = new UserPropositionService(
                Acl.getInstance(),
                UserPropositionResultRepository.getInstance(),
                PropositionRepository.getInstance(),
                CampaignRepository.getInstance(),
                CampaignUserRepository.getInstance(),
                CampaignUserStatusRepository.getInstance(),
                BordaAlgorithm.getInstance(),
                RelativeMajorityAlgorithm.getInstance()
            );
        }
        return UserPropositionService.instance;
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async initRanking(user, input) {
        const {
            user_id,
        } = user;

        const {
            campaign_id,
        } = input;

        await this.acl.checkUserIsACampaignMember(user_id, campaign_id);

        const proposition_list = await this.proposition_repository.search({
            campaign_id,
        });
        const user_proposition_result_list = await this.user_proposition_result_repository.search({
            campaign_id,
            user_id,
        });

        const proposition_result_to_create = proposition_list
            .filter((prop) => user_proposition_result_list
                .find(
                    (usr_prop_result) => prop.id === usr_prop_result.proposition_id
                ) === undefined
            );

        const proposition_created_list = [];
        for (const result_to_create of proposition_result_to_create) {
            // eslint-disable-next-line no-await-in-loop
            const proposition_created = await this.user_proposition_result_repository.create({
                campaign_id: result_to_create.campaign_id,
                proposition_id: result_to_create.id,
                user_id,
                rank: 0,
            });
            proposition_created_list.push(proposition_created);
        }

        return proposition_created_list;
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async updateRanking(user, input) {
        const {
            user_id,
        } = user;

        const {
            campaign_id,
            proposition_id_list,
        } = input;

        await this.acl.checkUserIsACampaignMember(user_id, campaign_id);

        const user_proposition_result_list = await this.user_proposition_result_repository
            .search({
                campaign_id,
                user_id,
                proposition_id_list,
            });

        const updated_user_proposition_result_list = [];
        for (const user_proposition_result of user_proposition_result_list) {
            // eslint-disable-next-line no-await-in-loop
            const update_result = await this.user_proposition_result_repository
                .update({
                    id: user_proposition_result.id,
                    rank: proposition_id_list.indexOf(user_proposition_result.id) + 1,
                });
            updated_user_proposition_result_list.push(update_result);
        }

        return updated_user_proposition_result_list;
    }

    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async getOwnRanking(user, input) {
        const {
            user_id,
        } = user;

        const {
            campaign_id,
        } = input;

        await this.acl.checkUserIsACampaignMember(user_id, campaign_id);
        const proposition_list = await this.proposition_repository.search({
            campaign_id,
            user_id,
        });

        return proposition_list;
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async getPropositionResult(user, input) {

        const {
            algorithm,
            user_id_list,
            campaign_id,
        } = input;

        const campaign_user_status_list = await this.campaign_user_status_repository
            .search({
                campaign_id,
                user_id_list,
                status_id: CampaignUserStatusRepository.RESULT_SUBMITED,
            });

        const user_proposition_result_list = await this.user_proposition_result_repository
            .search({
                user_id_list: campaign_user_status_list
                    .map((campaign_user_status) => campaign_user_status.user_id),
                campaign_id,
            });

        const proposition_list = await this.proposition_repository
            .search({
                campaign_id,
            });

        const vote_list = this.prepareUserVoteFormat(user_proposition_result_list);

        let result = [];
        if (algorithm === 'borda') {
            result = this.borda_algorithm.process(
                proposition_list.map((proposition) => proposition.id),
                vote_list
            );
        } else {
            result = this.relative_majority_algorithm.process(
                proposition_list.map((proposition) => proposition.id),
                vote_list
            );
        }

        return result.map((item) => {
            const proposition = proposition_list.find((prop) => prop.id === item);
            return {
                proposition_id: proposition.id,
                rank: result.indexOf(proposition.id) + 1,
                payload: proposition.payload,
            };
        });
    }


    /**
     * @param {Array} user_proposition_result_list
     * @returns {Array}
     */
    prepareUserVoteFormat(user_proposition_result_list) {

        const sorted_proposition_list = user_proposition_result_list
            .sort((a, b) => a.rank - b.rank);

        const user_vote_list = {};
        sorted_proposition_list.forEach((user_proposition_result) => {
            const {
                user_id,
                proposition_id,
            } = user_proposition_result;
            if (user_vote_list[user_id]) {
                user_vote_list[user_id].push(proposition_id);
            } else {
                user_vote_list[user_id] = [proposition_id];
            }
        });

        const result = [];
        Object.keys(user_vote_list).forEach((user_id) => {
            result.push(user_vote_list[user_id]);
        });
        return result;
    }
}

UserPropositionService.instance = null;

module.exports = {
    UserPropositionService,
};
