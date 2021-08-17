'use strict';

const {
    Acl,
    EloCalculator,
} = require('./commons');

const {
    CampaignRepository,
    PropositionRepository,
    CampaignUserRepository,
    UserPropositionEloResultRepository,
} = require('../repositories');

// const {
//     CustomError,
// } = require('../CustomError');


class UserEloPropositionService {

    /**
     * @param {Acl} acl
     * @param {EloCalculator} elo_calculator
     * @param {UserPropositionEloResultRepository} user_proposition_elo_result_repository
     * @param {PropositionRepository} proposition_repository
     * @param {CampaignRepository} campaign_repository
     * @param {CampaignUserRepository} campaign_user_repository
     */
    constructor(
        acl,
        elo_calculator,
        user_proposition_elo_result_repository,
        proposition_repository,
        campaign_repository,
        campaign_user_repository
    ) {
        this.acl = acl;
        this.elo_calculator = elo_calculator;
        this.user_proposition_elo_result_repository = user_proposition_elo_result_repository;
        this.proposition_repository = proposition_repository;
        this.campaign_repository = campaign_repository;
        this.campaign_user_repository = campaign_user_repository;
    }


    /* istanbul ignore next */
    /**
     * @static
     * @returns {UserEloPropositionService}
     */
    static getInstance() {
        if (UserEloPropositionService.instance === null) {
            UserEloPropositionService.instance = new UserEloPropositionService(
                Acl.getInstance(),
                EloCalculator.getInstance(),
                UserPropositionEloResultRepository.getInstance(),
                PropositionRepository.getInstance(),
                CampaignRepository.getInstance(),
                CampaignUserRepository.getInstance()
            );
        }
        return UserEloPropositionService.instance;
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async initEloRanking(user, input) {
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
        const user_proposition_elo_result_list = await this.user_proposition_elo_result_repository
            .search({
                campaign_id,
                user_id,
            });

        const proposition_elo_result_to_create = proposition_list
            .filter((prop) => user_proposition_elo_result_list
                .find(
                    (usr_prop_result) => prop.id === usr_prop_result.proposition_id
                ) === undefined
            );

        const proposition_elo_created_list = [];
        for (const result_to_create of proposition_elo_result_to_create) {
            // eslint-disable-next-line no-await-in-loop
            const proposition_created = await this.user_proposition_elo_result_repository.create({
                campaign_id: result_to_create.campaign_id,
                proposition_id: result_to_create.id,
                user_id,
                elo_score: 1000,
                display_count: 0,
            });
            proposition_elo_created_list.push(proposition_created);
        }

        return proposition_elo_created_list;
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async getEloRanking(user, input) {
        const {
            user_id,
        } = user;

        const {
            campaign_id,
        } = input;

        await this.acl.checkUserIsACampaignMember(user_id, campaign_id);
        const elo_result_proposition_list = await this
            .user_proposition_elo_result_repository.search(
                {
                    campaign_id,
                    user_id,
                },
                {
                    sort_list: ['-elo_score'],
                }
            );

        const proposition_list = await this.proposition_repository.search({
            id_list: elo_result_proposition_list
                .map((elo_result_proposition) => elo_result_proposition.proposition_id),
        });

        return elo_result_proposition_list.map((elo_result_proposition) => Object.assign(
            {},
            elo_result_proposition,
            {
                proposition: proposition_list
                    .find(
                        (proposition) => proposition.id === elo_result_proposition.proposition_id
                    ),
            }
        ));
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async processEloDuelResult(user, input) {
        const {
            user_id,
        } = user;

        const {
            campaign_id,
            proposition_id_1,
            proposition_id_2,
            winner,
        } = input;

        await this.acl.checkUserIsACampaignMember(user_id, campaign_id);
        const proposition_list = await this.user_proposition_elo_result_repository.search(
            {
                campaign_id,
                user_id,
                proposition_id_list: [
                    proposition_id_1,
                    proposition_id_2,
                ],
            }
        );

        const proposition_1 = proposition_list
            .find((proposition) => proposition.proposition_id === proposition_id_1);
        const proposition_2 = proposition_list
            .find((proposition) => proposition.proposition_id === proposition_id_2);


        let proposition_1_new_elo_score = null;
        let proposition_2_new_elo_score = null;

        if (winner === 0) {
            proposition_1_new_elo_score = this.elo_calculator
                .getScorePlayerEgality(proposition_1.elo_score, proposition_2.elo_score);
            proposition_2_new_elo_score = this.elo_calculator
                .getScorePlayerEgality(proposition_2.elo_score, proposition_1.elo_score);
        } else if (winner === 1) {
            proposition_1_new_elo_score = this.elo_calculator
                .getScorePlayerWins(proposition_1.elo_score, proposition_2.elo_score);
            proposition_2_new_elo_score = this.elo_calculator
                .getScorePlayerLose(proposition_2.elo_score, proposition_1.elo_score);
        } else {
            proposition_1_new_elo_score = this.elo_calculator
                .getScorePlayerLose(proposition_1.elo_score, proposition_2.elo_score);
            proposition_2_new_elo_score = this.elo_calculator
                .getScorePlayerWins(proposition_2.elo_score, proposition_1.elo_score);
        }

        const proposition_1_update_result = await this.user_proposition_elo_result_repository
            .update({
                id: proposition_1.id,
                elo_score: parseInt(proposition_1_new_elo_score, 10),
                display_count: proposition_1.display_count + 1,
            });

        const proposition_2_update_result = await this.user_proposition_elo_result_repository
            .update({
                id: proposition_2.id,
                elo_score: parseInt(proposition_2_new_elo_score, 10),
                display_count: proposition_2.display_count + 1,
            });

        return [
            proposition_1_update_result,
            proposition_2_update_result,
        ];
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Array}
     */
    async randomPropositions(user, input) {
        const {
            user_id,
        } = user;

        const {
            campaign_id,
        } = input;

        const all_propositions_list = await this.user_proposition_elo_result_repository
            .search(
                {
                    campaign_id,
                    user_id,
                },
                {
                    sort_list: [
                        'display_count',
                    ],
                }
            );

        const grouped_proposition_list = this.groupArrayByDisplayCount(all_propositions_list);
        const proposition_distributed_list = this.buildDistributedList(grouped_proposition_list);
        const proposition_1 = this.performRandomChoiceFromList(proposition_distributed_list);

        const other_propositions_list = all_propositions_list
            .filter((proposition) => proposition.proposition_id !== proposition_1.proposition_id);

        const proposition_2 = this.performRandomChoiceFromList(other_propositions_list);


        const proposition_random_list = [
            proposition_1,
            proposition_2,
        ];

        const proposition_list = await this.proposition_repository.search({
            id_list: proposition_random_list
                .map((elo_result_proposition) => elo_result_proposition.proposition_id),
        });

        return proposition_random_list.map((proposition_random) => Object.assign(
            {},
            proposition_random,
            {
                proposition: proposition_list
                    .find(
                        (proposition) => proposition.id === proposition_random.proposition_id
                    ),
            }
        ));

    }


    /**
     * @param {*} all_propositions_list
     * @return {Array}
     */
    groupArrayByDisplayCount(all_propositions_list) {

        all_propositions_list.sort((a, b) => {
            if (a.display_count > b.display_count) {
                return -1;
            }
            return 1;
        });

        const grouped_by_display_count_propositions = [];
        let last_display_count = null;
        let proposition_group = [];

        all_propositions_list.forEach((proposition) => {

            if (last_display_count === null) {
                last_display_count = proposition.display_count;
                proposition_group.push(proposition);

            } else if (last_display_count === proposition.display_count) {
                last_display_count = proposition.display_count;
                proposition_group.push(proposition);

            } else {
                last_display_count = proposition.display_count;

                grouped_by_display_count_propositions.push(proposition_group);
                proposition_group = [
                    proposition,
                ];
            }
        });
        if (proposition_group.length > 0) {
            grouped_by_display_count_propositions.push(proposition_group);
        }
        return grouped_by_display_count_propositions;
    }


    /**
     * @param {Array} grouped_proposition_list
     * @return {Array}
     */
    buildDistributedList(grouped_proposition_list) {
        const probability_list = [];

        for (let index = 0; index < grouped_proposition_list.length; index++) {
            grouped_proposition_list[index].forEach((proposition) => {
                for (let index_1 = 0; index_1 < (index + 1); index_1++) {
                    probability_list.push(proposition);
                }
            });
        }

        return probability_list;
    }

    /**
     * @param {Array} probability_list
     * @returns {Object}
     */
    performRandomChoiceFromList(probability_list) {
        const random_index = Math.ceil(Math.random() * probability_list.length) - 1;
        return probability_list[random_index];
    }

}

UserEloPropositionService.instance = null;

module.exports = {
    UserEloPropositionService,
};
