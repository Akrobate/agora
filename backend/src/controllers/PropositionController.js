'use strict';

const joi = require('joi');

const HTTP_CODE = require('http-status');

const {
    AbstractController,
} = require('./AbstractController');

const {
    PropositionService,
} = require('../services');


class PropositionController extends AbstractController {

    /**
     * @param {PropositionService} proposition_service
     */
    constructor(
        proposition_service
    ) {
        super();
        this.proposition_service = proposition_service;
    }


    /* istanbul ignore next */
    /**
     * @static
     * @returns {PropositionController}
     */
    static getInstance() {
        if (PropositionController.instance === null) {
            PropositionController.instance = new PropositionController(
                PropositionService.getInstance()
            );
        }

        return PropositionController.instance;
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async create(request, response) {

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
                        payload: joi.string()
                            .trim()
                            .min(1)
                            .required(),
                    })
                    .required(),
            })
            .unknown(true)
            .validate(request);

        this.checkValidationError(error);

        const proposition = await this.proposition_service.create(
            request.jwt_data,
            {
                campaign_id,
                payload: value.body.payload,
            }
        );

        return response.status(HTTP_CODE.CREATED).send(proposition);
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async read(request, response) {

        const {
            campaign_id,
            proposition_id,
        } = request.params;

        const data = await this.proposition_service.read(
            request.jwt_data,
            {
                campaign_id,
                proposition_id,
            }
        );

        return response.status(HTTP_CODE.OK).send(data);
    }

    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async search(request, response) {

        const {
            campaign_id,
        } = request.params;

        const data = await this.proposition_service.search(
            request.jwt_data,
            {
                campaign_id: Number(campaign_id),
            }
        );

        return response.status(HTTP_CODE.OK).send({
            proposition_list: data,
        });
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async delete(request, response) {

        const {
            campaign_id,
            proposition_id,
        } = request.params;

        await this.proposition_service.delete(
            request.jwt_data,
            {
                campaign_id,
                proposition_id,
            }
        );

        return response.status(HTTP_CODE.NO_CONTENT).send();
    }

}

PropositionController.instance = null;

module.exports = {
    PropositionController,
};
