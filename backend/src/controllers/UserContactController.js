'use strict';

const joi = require('joi');

const HTTP_CODE = require('http-status');

const {
    AbstractController,
} = require('./AbstractController');

const {
    UserContactTagService,
} = require('../services');


class UserContactController extends AbstractController {

    /**
     * @param {UserContactTagService} user_contact_tag_service
     */
    constructor(
        user_contact_tag_service
    ) {
        super();
        this.user_contact_tag_service = user_contact_tag_service;
    }


    /* istanbul ignore next */
    /**
     * @static
     * @returns {UserContactController}
     */
    static getInstance() {
        if (UserContactController.instance === null) {
            UserContactController.instance = new UserContactController(
                UserContactTagService.getInstance()
            );
        }

        return UserContactController.instance;
    }


    /**
     *
     * @todo
     *
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

        const user_proposition_elo_result_list = await this.user_contact_tag_service
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
