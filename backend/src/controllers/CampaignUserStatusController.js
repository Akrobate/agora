'use strict';

const joi = require('joi');

const HTTP_CODE = require('http-status');

const {
    CustomError,
} = require('../CustomError');

const {
    CampaignUserStatusService,
} = require('../services');


class CampaignUserStatusController {

    /**
     * @param {CampaignUserStatusService} campaign_user_status_service
     */
    constructor(
        campaign_user_status_service
    ) {
        this.campaign_user_status_service = campaign_user_status_service;
    }


    /**
     * @static
     * @returns {CampaignUserStatusController}
     */
    static getInstance() {
        if (CampaignUserStatusController.instance === null) {
            CampaignUserStatusController.instance = new CampaignUserStatusController(
                CampaignUserStatusService.getInstance()
            );
        }

        return CampaignUserStatusController.instance;
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async upsertStatus(request, response) {

        const campaign_id = Number(request.params.campaign_id);

        const {
            error,
            value,
        } = joi
            .object()
            .keys({
                body: joi.object()
                    .keys({
                        status_id: joi.number()
                            .required(),
                    })
                    .required(),
            })
            .unknown(true)
            .validate(request);

        if (error) {
            throw new CustomError(CustomError.BAD_PARAMETER, error.message);
        }

        const campaign_user_status = await this.campaign_user_status_service.updateCampaignStatus(
            request.jwt_data,
            {
                campaign_id,
                status_id: value.body.status_id,
            }
        );

        return response.status(HTTP_CODE.CREATED).send(campaign_user_status);
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async getCampaignStatus(request, response) {

        const campaign_id = Number(request.params.campaign_id);

        const campaign_user_status = await this.campaign_user_status_service.getCampaignStatus(
            request.jwt_data,
            {
                campaign_id,
            }
        );

        return response.status(HTTP_CODE.OK).send(campaign_user_status);
    }

}

CampaignUserStatusController.instance = null;

module.exports = {
    CampaignUserStatusController,
};
