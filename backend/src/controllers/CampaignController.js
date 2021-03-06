'use strict';

const joi = require('joi');

const HTTP_CODE = require('http-status');

const {
    AbstractController,
} = require('./AbstractController');

const {
    CampaignService,
} = require('../services');

class CampaignController extends AbstractController {

    /**
     * @param {CampaignService} campaign_service
     */
    constructor(
        campaign_service
    ) {
        super();
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
                        proposition_type: joi.string()
                            .min(1)
                            .required(),
                        campaign_status: joi.number()
                            .min(1)
                            .optional()
                            .default(1),
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

        this.checkValidationError(error);

        const user = await this.campaign_service.create(
            request.jwt_data,
            {
                title: value.body.title,
                description: value.body.description,
                proposition_type: value.body.proposition_type,
                campaign_status: value.body.campaign_status,
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
    async update(request, response) {

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
                        title: joi.string()
                            .trim()
                            .min(1)
                            .optional(),
                        description: joi.string()
                            .min(1)
                            .optional(),
                        proposition_type: joi.string()
                            .min(1)
                            .optional(),
                        campaign_status: joi.number()
                            .min(1)
                            .optional(),
                        start_date: joi.date()
                            .allow(null)
                            .optional(),
                        end_date: joi.date()
                            .allow(null)
                            .optional(),
                    })
                    .required(),
            })
            .unknown(true)
            .validate(request);

        this.checkValidationError(error);

        const user = await this.campaign_service.update(
            request.jwt_data,
            {
                ...value.body,
                id: Number(campaign_id),
            }
        );

        return response.status(HTTP_CODE.CREATED).send(user);
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async search(request, response) {

        const {
            error,
            value,
        } = joi
            .object()
            .keys({
                query: joi.object()
                    .keys({
                        id_list: joi
                            .array()
                            .items(
                                joi
                                    .number()
                                    .required()
                            )
                            .optional(),
                        campaign_status_list: joi
                            .array()
                            .items(
                                joi
                                    .number()
                                    .required()
                            )
                            .optional(),
                        sort_list: joi
                            .array()
                            .items(
                                joi
                                    .string()
                                    .required()
                            )
                            .optional(),
                    })
                    .required(),
            })
            .unknown(true)
            .validate(request);

        this.checkValidationError(error);

        const data = await this.campaign_service.search(
            request.jwt_data,
            value.query
        );

        return response.status(HTTP_CODE.OK).send({
            campaign_list: data,
        });
    }

    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async read(request, response) {

        const {
            campaign_id,
        } = request.params;

        const {
            jwt_data,
        } = request;

        const data = await this.campaign_service.read(
            jwt_data,
            {
                campaign_id,
            }
        );

        return response.status(HTTP_CODE.OK).send(data);
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async delete(request, response) {

        const {
            campaign_id,
        } = request.params;

        const {
            jwt_data,
        } = request;

        const data = await this.campaign_service.delete(
            jwt_data,
            {
                id: Number(campaign_id),
            }
        );

        return response.status(HTTP_CODE.OK).send(data);
    }

}

CampaignController.instance = null;

module.exports = {
    CampaignController,
};
