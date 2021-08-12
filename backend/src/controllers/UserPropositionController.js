'use strict';

const joi = require('joi');

const HTTP_CODE = require('http-status');

const {
    CustomError,
} = require('../CustomError');

const {
    UserPropositionService,
} = require('../services');


class UserPropositionController {

    /**
     * @param {UserPropositionService} proposition_user_service
     */
    constructor(
        proposition_user_service
    ) {
        this.proposition_user_service = proposition_user_service;
    }


    /* istanbul ignore next */
    /**
     * @static
     * @returns {UserPropositionController}
     */
    static getInstance() {
        if (UserPropositionController.instance === null) {
            UserPropositionController.instance = new UserPropositionController(
                UserPropositionService.getInstance()
            );
        }

        return UserPropositionController.instance;
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async initRanking(request, response) {

        const {
            campaign_id,
        } = request.params;

        const user_proposition_result_list = await this.proposition_user_service.initRanking(
            request.jwt_data,
            {
                campaign_id,
            }
        );

        return response.status(HTTP_CODE.CREATED).send({
            user_proposition_result_list,
        });
    }

    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async updateRanking(request, response) {

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
                        proposition_id_list: joi
                            .array()
                            .items(
                                joi
                                    .number()
                                    .required()
                            ),
                    })
                    .required(),
            })
            .unknown(true)
            .validate(request);

        if (error) {
            throw new CustomError(CustomError.BAD_PARAMETER, error.message);
        }

        const user_proposition_result_list = await this.proposition_user_service.updateRanking(
            request.jwt_data,
            {
                campaign_id,
                proposition_id_list: value.body.proposition_id_list,
            }
        );

        return response.status(HTTP_CODE.CREATED).send({
            user_proposition_result_list,
        });
    }

}

UserPropositionController.instance = null;

module.exports = {
    UserPropositionController,
};