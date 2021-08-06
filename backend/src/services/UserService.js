'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const {
    UserRepository,
    CampaignUserRepository,
} = require('../repositories');

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
     * @param {CampaignUserRepository} campaign_user_repository
     */
    constructor(
        user_repository,
        campaign_user_repository
    ) {
        this.user_repository = user_repository;
        this.campaign_user_repository = campaign_user_repository;

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
                UserRepository.getInstance(),
                CampaignUserRepository.getInstance()
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

        const jwt_user_data = {
            user_id: user.id,
            email: user.email,
            access_type: 'full',
        };

        let jwt_token = null;

        try {
            jwt_token = jwt.sign(jwt_user_data, this.jwt_private_key, this.jwt_config);
        } catch (error) {
            throw new CustomError(CustomError.INTERNAL_ERROR, error.message);
        }
        return {
            token: jwt_token,
        };
    }


    /**
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async loginGuest(input) {
        const {
            public_token,
        } = input;

        const campaign_user = await this.campaign_user_repository.find({
            public_token,
        });

        if (campaign_user === null) {
            throw new CustomError(CustomError.UNAUTHORIZED, 'Bad token');
        }

        const user = await this.user_repository.find({
            id_list: [
                campaign_user.user_id,
            ],
        });

        const jwt_user_data = {
            user_id: user.id,
            email: user.email,
            access_type: 'guest',
        };

        let jwt_token = null;

        try {
            jwt_token = jwt.sign(jwt_user_data, this.jwt_private_key, this.jwt_config);
        } catch (error) {
            throw new CustomError(CustomError.INTERNAL_ERROR, error.message);
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
