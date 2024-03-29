'use strict';

const status = require('http-status');
const {
    CustomError,
} = require('../CustomError');
const {
    logger,
} = require('../logger');

const error_mapper = {
    [CustomError.BAD_PARAMETER]: {
        status: status.BAD_REQUEST,
    },
    [CustomError.INTERNAL_ERROR]: {
        status: status.INTERNAL_SERVER_ERROR,
        message: 'Internal error',
    },
    [CustomError.ORM_ERROR]: {
        status: status.INTERNAL_SERVER_ERROR,
        // message: 'Internal error',
    },
    [CustomError.NOT_FOUND]: {
        status: status.NOT_FOUND,
        message: 'Document not found',
    },
    [CustomError.ALREADY_EXISTS]: {
        status: status.CONFLICT,
        message: 'Entity already exists',
    },
    [CustomError.UNAUTHORIZED]: {
        status: status.UNAUTHORIZED,
    },
    [CustomError.ACCESS_FORBIDDEN]: {
        status: status.FORBIDDEN,
    },
};

// eslint-disable-next-line no-unused-vars
const error_manager_middleware = (error, _, response, __) => {
    logger.log(error);
    if (error.code && error_mapper[error.code]) {
        const message = error.message_object ? error.message_object : {
            message: error_mapper[error.code].message,
        };
        return response
            .status(error_mapper[error.code].status)
            .json(message);
    }
    return response
        .status(status.INTERNAL_SERVER_ERROR)
        .json(
            {
                message: error.message,
            }
        );
};

const not_found_error_middleware = (_, result) => result.status(status.NOT_FOUND).send({});

module.exports = {
    error_manager_middleware,
    not_found_error_middleware,
};
