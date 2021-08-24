'use strict';

const HTTP_CODE = require('http-status');

const {
    AbstractController,
} = require('./AbstractController');

const {
    InvitationService,
} = require('../services');


class InvitationController extends AbstractController {

    /**
     * @param {InvitationService} invitation_service
     */
    constructor(
        invitation_service
    ) {
        super();
        this.invitation_service = invitation_service;
    }


    /* istanbul ignore next */
    /**
     * @static
     * @returns {InvitationController}
     */
    static getInstance() {
        if (InvitationController.instance === null) {
            InvitationController.instance = new InvitationController(
                InvitationService.getInstance()
            );
        }

        return InvitationController.instance;
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async sendCampaignUserInvitation(request, response) {

        const {
            campaign_user_id,
            campaign_id,
        } = request.params;

        const data = await this.invitation_service.sendCampaignUserInvitation(
            request.jwt_data,
            {
                campaign_id: Number(campaign_id),
                id: Number(campaign_user_id),
            }
        );

        return response.status(HTTP_CODE.CREATED).send(data);
    }


}

InvitationController.instance = null;

module.exports = {
    InvitationController,
};
