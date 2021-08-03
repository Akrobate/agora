'use strict';

const joi = require('joi');

const HTTP_CODE = require('http-status');

const {
    CustomError,
} = require('../CustomError');

const {
    UserService,
} = require('../services');


class UserController {

    /**
     * @param {UserService} user_service
     */
    constructor(
        user_service
    ) {
        this.user_service = user_service;
    }


    /**
     * @static
     * @returns {UserController}
     */
    static getInstance() {
        if (UserController.instance === null) {
            UserController.instance = new UserController(
                UserService.getInstance()
            );
        }

        return UserController.instance;
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async register(request, response) {

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
                        password: joi.string()
                            .trim()
                            .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
                            .required(),
                        first_name: joi.string()
                            .trim()
                            .optional()
                            .default(null),
                        last_name: joi.string()
                            .trim()
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

        const user = await this.user_service.register({
            email: value.body.email,
            password: value.body.password,
            first_name: value.body.first_name,
            last_name: value.body.last_name,
        });

        return response.status(HTTP_CODE.CREATED).send(user);
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async login(request, response) {

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
                        password: joi.string()
                            .trim()
                            .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
                            .required(),
                    })
                    .required(),
            })
            .unknown(true)
            .validate(request);

        if (error) {
            throw new CustomError(CustomError.BAD_PARAMETER, error.message);
        }

        const data = await this.user_service.login({
            email: value.body.email,
            password: value.body.password,
        });

        return response.status(HTTP_CODE.OK).send(data);
    }


}

UserController.instance = null;

module.exports = {
    UserController,
};
