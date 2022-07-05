'use strict';

const joi = require('joi');

const HTTP_CODE = require('http-status');

const {
    AbstractController,
} = require('./AbstractController');

const {
    UserService,
} = require('../services');


class UserController extends AbstractController {

    /**
     * @param {UserService} user_service
     */
    constructor(
        user_service
    ) {
        super();
        this.user_service = user_service;
    }


    /* istanbul ignore next */
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

        this.checkValidationError(error);


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
    async update(request, response) {
        const {
            user_id,
        } = request.params;

        const {
            error,
            value,
        } = joi
            .object()
            .keys({
                body: joi.object()
                    .keys({
                        first_name: joi.string()
                            .trim()
                            .optional(),
                        last_name: joi.string()
                            .trim()
                            .optional(),
                    })
                    .required(),
            })
            .unknown(true)
            .validate(request);

        this.checkValidationError(error);

        const user = await this.user_service.update(
            request.jwt_data,
            {
                id: parseInt(user_id, 10),
                ...value.body,
            }
        );

        return response.status(HTTP_CODE.CREATED).send(user);
    }

    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async read(request, response) {
        const {
            user_id,
        } = request.params;

        const user = await this.user_service.read(
            request.jwt_data,
            {
                id: Number(user_id),
            }
        );

        return response.status(HTTP_CODE.OK).send(user);
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
                            .required(),
                    })
                    .required(),
            })
            .unknown(true)
            .validate(request);

        this.checkValidationError(error);

        const data = await this.user_service.login({
            email: value.body.email,
            password: value.body.password,
        });

        return response.status(HTTP_CODE.OK).send(data);
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async renewToken(request, response) {
        const data = await this.user_service.renewToken(request.jwt_data);
        return response.status(HTTP_CODE.OK).send(data);
    }


    /**
     * @param {express.Request} request
     * @param {express.Response} response
     * @returns {Promise<*|Error>}
     */
    async loginGuest(request, response) {

        const {
            error,
            value,
        } = joi
            .object()
            .keys({
                body: joi.object()
                    .keys({
                        public_token: joi.string()
                            .trim()
                            .min(1)
                            .required(),
                    })
                    .required(),
            })
            .unknown(true)
            .validate(request);

        this.checkValidationError(error);

        const data = await this.user_service.loginGuest({
            public_token: value.body.public_token,
        });

        return response.status(HTTP_CODE.OK).send(data);
    }


}

UserController.instance = null;

module.exports = {
    UserController,
};
