'use strict';


const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {
    configuration,
} = require('../../src/configuration');

class DataSeeder {

    /**
     * @param {String} repository_name
     * @returns {Promise}
     */
    static truncate(repository_name) {
        const repository = DataSeeder.loadRepository(repository_name);
        return repository.sequelize_model.destroy({
            truncate: true,
            cascade: false,
        });
    }


    /**
     * @param {String} repository_name
     * @param {Object} input
     * @returns {Promise}
     */
    static create(repository_name, input) {
        const repository = DataSeeder.loadRepository(repository_name);
        return repository.create(input);
    }


    /**
     * @param {Object} input
     * @returns {Promise}
     */
    static createUserHashPassword(input) {
        return DataSeeder.create(
            'UserRepository',
            DataSeeder.hashPasswordInObject(input)
        );
    }


    /**
     * @param {Object} input
     * @returns {Promise}
     */
    static hashPasswordInObject(input) {
        if (input.password) {
            return Object.assign({}, input, {
                password: DataSeeder.hashPassword(input.password),
            });
        }
        return input;
    }


    /**
     * @param {String} password
     * @returns {Promise}
     */
    static hashPassword(password) {
        return crypto
            .createHash('sha256')
            .update(`${configuration.security.salt}${password}`)
            .digest('base64');
    }


    /**
     * @param {String} repository_name
     * @returns {Object}
     */
    static loadRepository(repository_name) {
        // eslint-disable-next-line global-require
        return require(`../../src/repositories/${repository_name}`)[repository_name].getInstance();
    }


    /**
     * @param {Object} user
     * @returns {String}
     */
    static getJwtFullAccessToken(user) {
        return DataSeeder.singJwt({
            user_id: user.id,
            email: user.email,
            access_type: 'full',
        });
    }


    /**
     * @param {Object} user
     * @returns {String}
     */
    static getJwtGuestAccessToken(user) {
        return DataSeeder.singJwt({
            user_id: user.id,
            email: user.email,
            access_type: 'guest',
        });
    }


    /**
     * @param {Object} input
     * @return {String}
     */
    static singJwt(input) {
        return jwt.sign(
            input,
            configuration.jwt.private_key,
            {
                algorithm: configuration.jwt.algorithm,
                expiresIn: configuration.jwt.default_token_duration,
            }
        );
    }


    /**
     * @param {String} jwt_token
     * @returns {Object}
     */
    static decodeJwt(jwt_token) {
        return jwt.verify(jwt_token, configuration.jwt.public_key);
    }
}

module.exports = {
    DataSeeder,
};