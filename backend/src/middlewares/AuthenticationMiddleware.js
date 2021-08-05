'use strict';

const {
    CustomError,
} = require('../CustomError');

const {
    configuration,
} = require('../configuration');

const jwt = require('jsonwebtoken');


class AuthenticationMiddleware {

    /**
     * @param {string} jwt_public_key
     */
    constructor(jwt_public_key) {
        this.jwt_public_key = jwt_public_key;
    }


    /**
     * @returns {AuthenticationMiddleware}
     */
    static getInstance() {
        if (AuthenticationMiddleware.instance === null) {
            AuthenticationMiddleware.instance = new AuthenticationMiddleware(
                configuration.jwt.public_key
            );
        }
        return AuthenticationMiddleware.instance;
    }


    /**
     *
     * @param {Object|*} request
     * @return {Promise<string>}
     */
    static getJwtFromHeader(request) {
        const authorization = request.get('Authorization');

        if (!(authorization && authorization.length > 0)) {
            throw new CustomError(CustomError.UNAUTHORIZED, 'Invalid token');
        }

        const authorization_parts = authorization.split(' ');
        if (authorization_parts.length !== 2) {
            throw new CustomError(CustomError.UNAUTHORIZED, 'Invalid authorization header');
        }

        if (authorization_parts[0] !== 'Bearer') {
            throw new CustomError(CustomError.UNAUTHORIZED, 'Invalid authorization header');
        }

        return authorization_parts[1];
    }


    /**
     *
     * @param {string} jwt_token
     * @return {Promise<Object>} - return jwt_data on success
     */
    checkJwtValidity(jwt_token) {
        let jwt_data = null;
        try {
            jwt_data = jwt.verify(jwt_token, this.jwt_public_key);
        } catch (error) {
            throw new CustomError(CustomError.UNAUTHORIZED, error.message);
        }
        return jwt_data;
    }


    /**
     *
     * @param {boolean} check_expired_password
     * @return {Function}
     */
    injectJwtData() {
        return (request, response, next) => {
            try {
                const jwt_token = AuthenticationMiddleware.getJwtFromHeader(request);
                const jwt_data = this.checkJwtValidity(jwt_token);
                request.jwt_data = jwt_data;
            } catch (error) {
                return next(error);
            }
            return next();
        };
    }

}

AuthenticationMiddleware.instance = null;

module.exports = {
    AuthenticationMiddleware,
};

