'use strict';

const {
    Router,
} = require('express');

const {
    UserController,
} = require('../controllers/UserController');

const api_routes = Router(); // eslint-disable-line new-cap

const user_controller = UserController.getInstance();

const url_prefix = '/api/v1';

api_routes.post(
    '/users/register',
    (request, response, next) => user_controller
        .register(request, response)
        .catch(next)
);

api_routes.post(
    '/users/login',
    (request, response, next) => user_controller
        .login(request, response)
        .catch(next)
);

module.exports = {
    api_routes,
    url_prefix,
};
