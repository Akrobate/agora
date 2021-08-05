'use strict';

const {
    CampaignRepository,
} = require('../repositories');

const {
    CampaignUserRepository,
} = require('../repositories');

const {
    CustomError,
} = require('../CustomError');


class CampaignService {

    /**
     * Constructor.
     * @param {CampaignRepository} campaign_repository
     * @param {CampaignUserRepository} campaign_user_repository
     */
    constructor(
        campaign_repository,
        campaign_user_repository
    ) {
        this.campaign_repository = campaign_repository;
        this.campaign_user_repository = campaign_user_repository;
    }

    /**
     * @static
     * @returns {CampaignService}
     */
    static getInstance() {
        if (CampaignService.instance === null) {
            CampaignService.instance = new CampaignService(
                CampaignRepository.getInstance(),
                CampaignUserRepository.getInstance()
            );
        }
        return CampaignService.instance;
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async get(user, input) {

    }

    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async create(user, input) {
        if (user.access_type === 'guest') {
            throw new CustomError(CustomError.UNAUTHORIZED, 'Guest user cannot create campaigns');
        }

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

}

CampaignService.instance = null;

module.exports = {
    CampaignService,
};
