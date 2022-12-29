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
    async search(request, response) {

        const {
            error,
            value,
        } = joi
            .object()
            .keys({
                query: joi.object()
                    .keys({
                        tag_id_list: joi
                            .array()
                            .items(
                                joi
                                    .number()
                                    .required()
                            )
                            .optional(),
                        user_id: joi.number()
                            .required(),
                        contact_id_list: joi
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

        const user_contact_list = await this.user_contact_tag_service
            .search(
                request.jwt_data,
                {
                    tag_id_list: value.query.tag_id_list,
                    contact_id_list: value.query.contact_id_list,
                    user_id: value.query.user_id,
                }
            );

        return response.status(HTTP_CODE.OK).send({
            user_contact_list,
        });
    }

}

UserContactController.instance = null;

module.exports = {
    UserContactController,
};
