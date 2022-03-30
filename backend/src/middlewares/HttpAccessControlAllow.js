'use strict';

const access_control_allow_middleware = (request, response, next) => {
    if (request.headers) {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
        response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
        response.header('Access-Control-Allow-Credentials', 'false');
    }
    return next();
};

module.exports = {
    access_control_allow_middleware,
};
