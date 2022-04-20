'use strict';

const {
    error_manager_middleware,
    not_found_error_middleware,
} = require('./HttpErrorManager');
const {
    access_control_allow_middleware,
} = require('./HttpAccessControlAllow');

const {
    cors_middleware,
    express_urlencoded_middleware,
    express_json,
} = require('./HttpGenericExpress');

module.exports = {
    error_manager_middleware,
    not_found_error_middleware,
    access_control_allow_middleware,
    cors_middleware,
    express_urlencoded_middleware,
    express_json,
};
