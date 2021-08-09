'use strict';

const joi = require('joi');

const HTTP_CODE = require('http-status');

const {
    CustomError,
} = require('../CustomError');

const {
    CampaignService,
} = require('../services');


class CampaignController {

    /**
     * @param {CampaignService} campaign_service
     */
    constructor(
        campaign_service
    ) {
        this.campaign_service = campaign_service;
    }


    /* istanbul ignore next */
    /**
     * @static
     * @returns {CampaignController}
     */
    static getInstance() {
        if (CampaignController.instance === null) {
            CampaignController.instance = new CampaignController(
                CampaignService.getInstance()
            );
        }

        return CampaignController.instance;
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async create(request, response) {

        const {
            error,
            value,
        } = joi
            .object()
            .keys({
                body: joi.object()
                    .keys({
                        title: joi.string()
                            .trim()
                            .min(1)
                            .required(),
                        description: joi.string()
                            .min(1)
                            .allow(null)
                            .optional()
                            .default(null),
                        start_date: joi.date()
                            .allow(null)
                            .optional()
                            .default(null),
                        end_date: joi.date()
                            .allow(null)
                            .optional()
                            .default(null),
                    })
                    .required(),
            })
            .unknown(true)
            .validate(request);

        if (error) {
            throw new CustomError(CustomError.BAD_PARAMETER, error.message);
        }

        const user = await this.campaign_service.create(
            request.jwt_data,
            {
                title: value.body.title,
                description: value.body.description,
                start_date: value.body.start_date,
                end_date: value.body.end_date,
            }
        );

        return response.status(HTTP_CODE.CREATED).send(user);
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async get(request, response) {

        const {
            id,
        } = request.params;

        const data = await this.campaign_service.get({
            id,
        });

        return response.status(HTTP_CODE.OK).send(data);
    }


}

CampaignController.instance = null;

module.exports = {
    CampaignController,
};
