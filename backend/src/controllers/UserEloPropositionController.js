'use strict';

const joi = require('joi');

const HTTP_CODE = require('http-status');

const {
    AbstractController,
} = require('./AbstractController');

const {
    UserEloPropositionService,
} = require('../services');


class UserEloPropositionController extends AbstractController {

    /**
     * @param {UserEloPropositionService} proposition_elo_user_service
     */
    constructor(
        proposition_elo_user_service
    ) {
        super();
        this.proposition_elo_user_service = proposition_elo_user_service;
    }


    /* istanbul ignore next */
    /**
     * @static
     * @returns {UserEloPropositionController}
     */
    static getInstance() {
        if (UserEloPropositionController.instance === null) {
            UserEloPropositionController.instance = new UserEloPropositionController(
                UserEloPropositionService.getInstance()
            );
        }

        return UserEloPropositionController.instance;
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async initEloRanking(request, response) {

        const {
            campaign_id,
        } = request.params;

        const user_proposition_elo_result_list = await this.proposition_elo_user_service
            .initEloRanking(
                request.jwt_data,
                {
                    campaign_id,
                }
            );

        return response.status(HTTP_CODE.CREATED).send({
            user_proposition_elo_result_list,
        });
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async getEloRanking(request, response) {

        const {
            campaign_id,
        } = request.params;

        const user_proposition_elo_result_list = await this.proposition_elo_user_service
            .getEloRanking(
                request.jwt_data,
                {
                    campaign_id,
                }
            );

        return response.status(HTTP_CODE.OK).send({
            user_proposition_elo_result_list,
        });
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async processEloDuelResult(request, response) {

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
                        proposition_id_1: joi.number()
                            .required(),
                        proposition_id_2: joi.number()
                            .required(),
                        winner: joi.number()
                            .valid(1, 2, 0)
                            .required(),
                    })
                    .required(),
            })
            .unknown(true)
            .validate(request);

        this.checkValidationError(error);

        const user_proposition_elo_result_list = await this.proposition_elo_user_service
            .processEloDuelResult(
                request.jwt_data,
                {
                    campaign_id,
                    proposition_id_1: value.body.proposition_id_1,
                    proposition_id_2: value.body.proposition_id_2,
                    winner: value.body.winner,
                }
            );

        return response.status(HTTP_CODE.OK).send({
            user_proposition_elo_result_list,
        });
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async randomPropositions(request, response) {

        const {
            campaign_id,
        } = request.params;

        const random_propositions = await this.proposition_elo_user_service
            .randomPropositions(
                request.jwt_data,
                {
                    campaign_id,
                }
            );

        return response.status(HTTP_CODE.OK).send({
            random_propositions,
        });
    }

}

UserEloPropositionController.instance = null;

module.exports = {
    UserEloPropositionController,
};
