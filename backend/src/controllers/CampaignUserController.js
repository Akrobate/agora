'use strict';

const joi = require('joi');

const HTTP_CODE = require('http-status');

const {
    CustomError,
} = require('../CustomError');

const {
    CampaignUserService,
} = require('../services');


class CampaignUserController {

    /**
     * @param {CampaignUserService} campaign_user_service
     */
    constructor(
        campaign_user_service
    ) {
        this.campaign_user_service = campaign_user_service;
    }


    /**
     * @static
     * @returns {CampaignUserController}
     */
    static getInstance() {
        if (CampaignUserController.instance === null) {
            CampaignUserController.instance = new CampaignUserController(
                CampaignUserService.getInstance()
            );
        }

        return CampaignUserController.instance;
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async addUserToCampaign(request, response) {

        const {
            campaign_id,
        } = request.params;

        const {
            error,
            value,
        } = joi
            .object()
            .keys({
                body: joi.object()
                    .keys({
                        email: joi.string()
                            .trim()
                            .min(1)
                            .required(),
                        access_level: joi.number()
                            .required(),
                    })
                    .required(),
            })
            .unknown(true)
            .validate(request);

        if (error) {
            throw new CustomError(CustomError.BAD_PARAMETER, error.message);
        }

        const user = await this.campaign_user_service.addUserToCampaign(
            request.jwt_data,
            {
                campaign_id,
                email: value.body.email,
                access_level: value.body.access_level,
            }
        );

        return response.status(HTTP_CODE.CREATED).send(user);
    }

}

CampaignUserController.instance = null;

module.exports = {
    CampaignUserController,
};
