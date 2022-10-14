'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const {
    UserRepository,
    CampaignUserRepository,
} = require('../repositories');

const {
    EmailService,
} = require('./EmailService');

const {
    CustomError,
} = require('../CustomError');

const {
    configuration,
} = require('../configuration');

const {
    Acl,
} = require('./commons');


class UserService {

    /**
     * Constructor.
     * @param {Acl} acl
     * @param {UserRepository} user_repository
     * @param {CampaignUserRepository} campaign_user_repository
     * @param {EmailService} email_service
     */
    constructor(
        acl,
        user_repository,
        campaign_user_repository,
        email_service
    ) {
        this.acl = acl;
        this.user_repository = user_repository;
        this.campaign_user_repository = campaign_user_repository;
        this.email_service = email_service;

        this.jwt_private_key = configuration.jwt.private_key;
        this.jwt_public_key = configuration.jwt.public_key;
        this.jwt_config = {
            algorithm: configuration.jwt.algorithm,
            expiresIn: configuration.jwt.default_token_duration,
        };
    }


    /* istanbul ignore next */
    /**
     * @static
     * @returns {UserService}
     */
    static getInstance() {
        if (UserService.instance === null) {
            UserService.instance = new UserService(
                Acl.getInstance(),
                UserRepository.getInstance(),
                CampaignUserRepository.getInstance(),
                EmailService.getInstance()
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
            email,
        } = input;


        const existing_user = await this.user_repository.find({
            email,
        });

        if (existing_user === null) {
            return this.user_repository
                .create({
                    ...input,
                    password: UserService.hashPassword(password),
                });
        }

        if (existing_user.password !== null) {
            throw new CustomError(CustomError.BAD_PARAMETER, 'Email already exists');
        }

        return this.user_repository.update({
            ...input,
            password: UserService.hashPassword(password),
            id: existing_user.id,
        });
    }


    /**
     * @param {String} password
     * @returns {String}
     */
    static hashPassword(password) {
        return crypto
            .createHash('sha256')
            .update(`${configuration.security.salt}${password}`)
            .digest('base64');
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

        const jwt_token = this.tryToSignJwt(jwt_user_data, this.jwt_private_key, this.jwt_config);

        return {
            token: jwt_token,
        };
    }


    /**
     * @param {Object} user
     * @returns {Promise<*|Error>}
     */
    async renewToken(user) {
        const {
            user_id,
            email,
            access_type,
        } = user;

        const user_found = await this.user_repository.find({
            email,
        });

        if (user_found === null) {
            throw new CustomError(CustomError.UNAUTHORIZED, 'Access denied');
        }

        const jwt_user_data = {
            user_id,
            email,
            access_type,
        };

        const jwt_token = this.tryToSignJwt(jwt_user_data, this.jwt_private_key, this.jwt_config);

        return {
            token: jwt_token,
        };
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async update(user, input) {
        const {
            id,
        } = input;
        this.acl.checkUserModifiesOwnData(user.user_id, id);
        const user_updated = await this.user_repository.update(input);
        return user_updated;
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async updatePassword(user, input) {
        const {
            id,
            old_password,
            new_password,
        } = input;
        this.acl.checkUserModifiesOwnData(user.user_id, id);

        const stored_user = await this.user_repository.find({
            id,
        });

        if (UserService.hashPassword(old_password) !== stored_user.password) {
            throw new CustomError(CustomError.ACCESS_FORBIDDEN, 'Bad old password');
        }

        const user_updated = await this.user_repository.update({
            id,
            password: UserService.hashPassword(new_password),
        });

        return user_updated;
    }


    /**
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async forgottenPassword(input) {
        const {
            email,
        } = input;

        const stored_user = await this.user_repository.find({
            email,
        });

        const forgotten_password_token = await this.generateForgottenPasswordToken(stored_user);

        await this.email_service.sendForgottenPasswordMail({
            to: email,
            forgotten_password_token,
            user_id: stored_user.id,
        });
    }


    /**
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async updateForgottenPassword(input) {
        const {
            id,
            forgotten_password_token,
            new_password,
        } = input;

        const stored_user = await this.user_repository.find({
            id,
        });

        const generated_forgotten_password_token = await this
            .generateForgottenPasswordToken(stored_user);

        if (generated_forgotten_password_token !== forgotten_password_token) {
            throw new CustomError(CustomError.UNAUTHORIZED, 'Cannot update forgotten password, please retry');
        }

        await this.user_repository.update({
            id,
            password: UserService.hashPassword(new_password),
        });
    }


    /**
     * @param {Object} user
     * @return {String}
     */
    generateForgottenPasswordToken(user) {
        const {
            email,
            id,
            password,
        } = user;

        return crypto
            .createHash('sha256')
            .update(`${configuration.security.salt}${id}${email}${password}`)
            .digest('base64');
    }

    /**
     * @param {Object} user_data
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async read(user_data, input) {
        const {
            id,
        } = input;

        if (user_data.user_id !== input.id) {
            throw new CustomError(CustomError.UNAUTHORIZED, 'User can only read own data');
        }
        const user = await this.user_repository.find({
            id,
        });

        if (user === null) {
            throw new CustomError(CustomError.UNAUTHORIZED, 'User data cannot be accessed');
        }

        return user;
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
            invited_to_campaign_id: campaign_user.campaign_id,
        };

        const jwt_token = this.tryToSignJwt(jwt_user_data, this.jwt_private_key, this.jwt_config);

        return {
            token: jwt_token,
        };
    }


    /**
     * @param {Object} jwt_user_data 
     * @param {String} jwt_private_key 
     * @param {Object} jwt_config 
     * 
     * @return {Object|Error}
     */
    tryToSignJwt(jwt_user_data, jwt_private_key, jwt_config) {
        let jwt_token = null;
        try {
            jwt_token = jwt.sign(jwt_user_data, this.jwt_private_key, this.jwt_config);
        } catch (error) {
            throw new CustomError(CustomError.INTERNAL_ERROR, error.message);
        }
        return jwt_token;
    }


}

UserService.instance = null;

module.exports = {
    UserService,
};
