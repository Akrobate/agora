'use strict';

const joi = require('joi');

const HTTP_CODE = require('http-status');

const {
    AbstractController,
} = require('./AbstractController');

const {
    CampaignUserStatusService,
} = require('../services');


class CampaignUserStatusController extends AbstractController {

    /**
     * @param {CampaignUserStatusService} campaign_user_status_service
     */
    constructor(
        campaign_user_status_service
    ) {
        super();
        this.campaign_user_status_service = campaign_user_status_service;
    }


    /* istanbul ignore next */
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

        this.checkValidationError(error);


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

        const {
            error,
            value,
        } = joi
            .object()
            .keys({
                query: joi.object()
                    .keys({
                        status_id: joi.number()
                            .optional(),
                    })
                    .required(),
            })
            .unknown(true)
            .validate(request);

        this.checkValidationError(error);

        const campaign_user_status_list = await this.campaign_user_status_service.getCampaignStatus(
            request.jwt_data,
            {
                ...value.query,
                campaign_id,
            }
        );

        return response.status(HTTP_CODE.OK).send({
            campaign_user_status_list,
        });
    }

}

CampaignUserStatusController.instance = null;

module.exports = {
    CampaignUserStatusController,
};
