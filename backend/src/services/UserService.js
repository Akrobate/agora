'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const {
    UserRepository,
} = require('../repositories/UserRepository');

const {
    CustomError,
} = require('../CustomError');

const {
    configuration,
} = require('../configuration');


class UserService {

    /**
     * Constructor.
     * @param {UserRepository} user_repository
     */
    constructor(
        user_repository
    ) {
        this.user_repository = user_repository;

        this.jwt_private_key = configuration.jwt.private_key;
        this.jwt_public_key = configuration.jwt.public_key;
        this.jwt_config = {
            algorithm: configuration.jwt.algorithm,
            expiresIn: configuration.jwt.default_token_duration,
        };
    }

    /**
     * @static
     * @returns {UserService}
     */
    static getInstance() {
        if (UserService.instance === null) {
            UserService.instance = new UserService(
                UserRepository.getInstance()
            );
        }
        return UserService.instance;
    }


    /**
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async register(input) {

        const {
            password,
        } = input;

        const user = await this.user_repository
            .create(Object.assign({}, input, {
                password: UserService.hashPassword(password),
            }));
        return user;
    }


    /**
     * @param {String} password
     * @returns {String}
     */
    static hashPassword(password) {
        const hashed_password = crypto
            .createHash('sha256')
            .update(`${configuration.security.salt}${password}`)
            .digest('base64');
        return hashed_password;
    }


    /**
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async login(input) {
        const {
            email,
            password,
        } = input;

        const user = await this.user_repository.find({
            email,
        });

        if (user === null) {
            throw new CustomError(CustomError.UNAUTHORIZED, 'Bad login or password');
        }

        if (user.password !== UserService.hashPassword(password)) {
            throw new CustomError(CustomError.UNAUTHORIZED, 'Bad login or password');
        }

        let jwt_token = null;

        try {
            jwt_token = jwt.sign(input, this.jwt_private_key, this.jwt_config);
        } catch (error) {
            // @todo: Mutate error
            throw new CustomError(error);
        }
        return {
            token: jwt_token,
        };
    }


}

UserService.instance = null;

module.exports = {
    UserService,
};
