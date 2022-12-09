'use strict';

const joi = require('joi');

const HTTP_CODE = require('http-status');

const {
    AbstractController,
} = require('./AbstractController');

const {
    CampaignService,
} = require('../services');

class ContactTagController extends AbstractController {

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
     * @returns {ContactTagController}
     */
    static getInstance() {
        if (ContactTagController.instance === null) {
            ContactTagController.instance = new ContactTagController(
                CampaignService.getInstance()
            );
        }

        return ContactTagController.instance;
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
                        name: joi.string()
                            .trim()
                            .min(1)
                            .required(),
                        user_id: joi.number()
                            .min(1)
                            .required(),
                    })
                    .required(),
            })
            .unknown(true)
            .validate(request);

        this.checkValidationError(error);

        const user = await this.campaign_service.create(
            request.jwt_data,
            {
                name: value.body.name,
                user_id: value.body.user_id,
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
            tag_id,
        } = request.params;

        const {
            error,
            value,
        } = joi
            .object()
            .keys({
                body: joi.object()
                    .keys({
                        name: joi.string()
                            .trim()
                            .min(1)
                            .required(),
                        user_id: joi.number()
                            .min(1)
                            .required(),
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
                id: Number(tag_id),
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
                        name_list: joi
                            .array()
                            .items(
                                joi
                                    .string()
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
            tag_list: data,
        });
    }

    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async read(request, response) {

        const {
            tag_id,
        } = request.params;

        const {
            jwt_data,
        } = request;

        const data = await this.campaign_service.read(
            jwt_data,
            {
                tag_id,
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
            tag_id,
        } = request.params;

        const {
            jwt_data,
        } = request;

        const data = await this.campaign_service.delete(
            jwt_data,
            {
                id: Number(tag_id),
            }
        );

        return response.status(HTTP_CODE.OK).send(data);
    }

}

ContactTagController.instance = null;

module.exports = {
    ContactTagController,
};
