'use strict';

const {
    Acl,
} = require('./commons');

const {
    CampaignRepository,
    PropositionRepository,
    CampaignUserRepository,
    UserPropositionResultRepository,
} = require('../repositories');

// const {
//     CustomError,
// } = require('../CustomError');


class UserPropositionService {

    /**
     * @param {Acl} acl
     * @param {UserPropositionResultRepository} user_proposition_result_repository
     * @param {PropositionRepository} proposition_repository
     * @param {CampaignRepository} campaign_repository
     * @param {CampaignUserRepository} campaign_user_repository
     */
    constructor(
        acl,
        user_proposition_result_repository,
        proposition_repository,
        campaign_repository,
        campaign_user_repository
    ) {
        this.acl = acl;
        this.user_proposition_result_repository = user_proposition_result_repository;
        this.proposition_repository = proposition_repository;
        this.campaign_repository = campaign_repository;
        this.campaign_user_repository = campaign_user_repository;
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
                CampaignUserRepository.getInstance()
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
    async getRanking(user, input) {
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

}

UserPropositionService.instance = null;

module.exports = {
    UserPropositionService,
};
