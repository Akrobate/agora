'use strict';

const {
    CampaignRepository,
    CampaignUserRepository,
    UserRepository,
} = require('../repositories');

const {
    CustomError,
} = require('../CustomError');


class CampaignUserService {

    /**
     * Constructor.
     * @param {CampaignRepository} campaign_repository
     * @param {CampaignUserRepository} campaign_user_repository
     * @param {UserRepository} user_repository
     */
    constructor(
        campaign_repository,
        campaign_user_repository,
        user_repository
    ) {
        this.campaign_repository = campaign_repository;
        this.campaign_user_repository = campaign_user_repository;
        this.user_repository = user_repository;
    }

    /**
     * @static
     * @returns {CampaignUserService}
     */
    static getInstance() {
        if (CampaignUserService.instance === null) {
            CampaignUserService.instance = new CampaignUserService(
                CampaignRepository.getInstance(),
                CampaignUserRepository.getInstance(),
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
        } = input;

        if (user.access_type === 'full') {
            throw new CustomError(CustomError.UNAUTHORIZED, 'Guest user cannot create campaigns');
        }

        const campaign_user = await this.campaign_user_repository
            .find(Object.assign(
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

CampaignUserService.instance = null;

module.exports = {
    CampaignUserService,
};
