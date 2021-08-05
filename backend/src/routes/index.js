'use strict';

const {
    Router,
} = require('express');

const {
    UserController,
    CampaignController,
} = require('../controllers');

const {
    AuthenticationMiddleware,
} = require('../middlewares/AuthenticationMiddleware');

const api_routes = Router(); // eslint-disable-line new-cap

const authentication_middleware = AuthenticationMiddleware.getInstance();
const user_controller = UserController.getInstance();
const campaign_controller = CampaignController.getInstance();

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

api_routes.post(
    '/campaigns',
    authentication_middleware.injectJwtData(),
    (request, response, next) => campaign_controller
        .create(request, response)
        .catch(next)
);


module.exports = {
    api_routes,
    url_prefix,
};
