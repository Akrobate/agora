'use strict';

const {
    CampaignRepository,
    CampaignUserRepository,
} = require('../repositories');

const {
    Acl,
} = require('./commons');

// const {
//     CustomError,
// } = require('../CustomError');


class CampaignService {

    /**
     * Constructor.
     * @param {Acl} acl
     * @param {CampaignRepository} campaign_repository
     * @param {CampaignUserRepository} campaign_user_repository
     */
    constructor(
        acl,
        campaign_repository,
        campaign_user_repository
    ) {
        this.acl = acl;
        this.campaign_repository = campaign_repository;
        this.campaign_user_repository = campaign_user_repository;
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
    // async read(user, input) {
    //
    // }


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

}

CampaignService.instance = null;

module.exports = {
    CampaignService,
};
