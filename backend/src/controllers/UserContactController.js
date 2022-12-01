'use strict';

const joi = require('joi');

const HTTP_CODE = require('http-status');

const {
    AbstractController,
} = require('./AbstractController');

const {
    UserEloPropositionService,
} = require('../services');


class UserContactController extends AbstractController {

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
     * @returns {UserContactController}
     */
    static getInstance() {
        if (UserContactController.instance === null) {
            UserContactController.instance = new UserContactController(
                UserEloPropositionService.getInstance()
            );
        }

        return UserContactController.instance;
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async searchContactsTags(request, response) {

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

}

UserContactController.instance = null;

module.exports = {
    UserContactController,
};
