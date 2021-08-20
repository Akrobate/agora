'use strict';

const joi = require('joi');

const HTTP_CODE = require('http-status');

const {
    AbstractController,
} = require('./AbstractController');

const {
    CampaignUserService,
} = require('../services');


class CampaignUserController extends AbstractController {

    /**
     * @param {CampaignUserService} campaign_user_service
     */
    constructor(
        campaign_user_service
    ) {
        super();
        this.campaign_user_service = campaign_user_service;
    }


    /* istanbul ignore next */
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
                        is_participant: joi.boolean()
                            .optional()
                            .default(true),
                    })
                    .required(),
            })
            .unknown(true)
            .validate(request);

        this.checkValidationError(error);


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


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async updateCampaignUser(request, response) {

        const {
            campaign_id,
            campaign_user_id,
        } = request.params;

        const {
            error,
            value,
        } = joi
            .object()
            .keys({
                body: joi.object()
                    .keys({
                        access_level: joi.number()
                            .optional(),
                        is_participant: joi.boolean()
                            .optional(),
                    })
                    .required(),
            })
            .unknown(true)
            .validate(request);

        this.checkValidationError(error);

        const campaign_user = await this.campaign_user_service.updateCampaignUser(
            request.jwt_data,
            {
                id: campaign_user_id,
                campaign_id,
                access_level: value.body.access_level,
                is_participant: value.body.is_participant,
            }
        );

        return response.status(HTTP_CODE.OK).send(campaign_user);
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async searchCampaignUsers(request, response) {

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
                        id_list: joi
                            .array()
                            .items(
                                joi
                                    .number()
                                    .required()
                            )
                            .optional(),
                        is_participant: joi.boolean()
                            .optional(),
                        status_id_list: joi
                            .array()
                            .items(
                                joi
                                    .number()
                                    .required()
                            )
                            .optional(),
                    })
                    .required(),
            })
            .unknown(true)
            .validate(request);

        this.checkValidationError(error);

        const campaign_user_list = await this.campaign_user_service.searchCampaignUsers(
            request.jwt_data,
            Object.assign(
                {},
                value.query,
                {
                    campaign_id,
                }
            )
        );

        return response.status(HTTP_CODE.OK).send({
            campaign_user_list,
        });
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async removeCampaignUser(request, response) {

        const {
            campaign_id,
            campaign_user_id,
        } = request.params;

        await this.campaign_user_service.removeCampaignUser(
            request.jwt_data,
            {
                campaign_id,
                id: campaign_user_id,
            }
        );

        return response.status(HTTP_CODE.OK).send({});
    }

}

CampaignUserController.instance = null;

module.exports = {
    CampaignUserController,
};
