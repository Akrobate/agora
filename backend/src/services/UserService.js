'use strict';

// const {
//     CustomError,
// } = require('../CustomError');

const {
    UserRepository,
} = require('../repositories/UserRepository');

const {
    configuration,
} = require('../configuration');

const jwt = require('jsonwebtoken');

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
        const user = await this.user_repository.create(input);
        return user;
    }


    /**
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    login(input) {
        let jwt_token = null;
        try {
            jwt_token = jwt.sign(input, this.jwt_private_key, this.jwt_config);
        } catch (error) {
            // @todo: Mutate error
            console.log(error);
        }
        return Promise.resolve({
            token: jwt_token,
        });
    }


}

UserService.instance = null;

module.exports = {
    UserService,
};
