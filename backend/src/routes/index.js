'use strict';

const {
    Router,
} = require('express');

const {
    UserController,
    CampaignController,
    CampaignUserController,
    PropositionController,
} = require('../controllers');

const {
    AuthenticationMiddleware,
} = require('../middlewares/AuthenticationMiddleware');

const api_routes = Router(); // eslint-disable-line new-cap

const authentication_middleware = AuthenticationMiddleware.getInstance();
const user_controller = UserController.getInstance();
const campaign_controller = CampaignController.getInstance();
const campaign_user_controller = CampaignUserController.getInstance();
const proposition_controller = PropositionController.getInstance();

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
    '/users/login/guest',
    (request, response, next) => user_controller
        .loginGuest(request, response)
        .catch(next)
);

api_routes.patch(
    '/users/:user_id',
    authentication_middleware.injectJwtData(),
    (request, response, next) => user_controller
        .update(request, response)
        .catch(next)
);

api_routes.get(
    '/users/:user_id',
    authentication_middleware.injectJwtData(),
    (request, response, next) => user_controller
        .read(request, response)
        .catch(next)
);

api_routes.post(
    '/campaigns',
    authentication_middleware.injectJwtData(),
    (request, response, next) => campaign_controller
        .create(request, response)
        .catch(next)
);

api_routes.post(
    '/campaigns/:campaign_id/users',
    authentication_middleware.injectJwtData(),
    (request, response, next) => campaign_user_controller
        .addUserToCampaign(request, response)
        .catch(next)
);


api_routes.post(
    '/campaigns/:campaign_id/propositions',
    authentication_middleware.injectJwtData(),
    (request, response, next) => proposition_controller
        .create(request, response)
        .catch(next)
);

api_routes.get(
    '/campaigns/:campaign_id/propositions/:proposition_id',
    authentication_middleware.injectJwtData(),
    (request, response, next) => proposition_controller
        .read(request, response)
        .catch(next)
);

api_routes.get(
    '/campaigns/:campaign_id/propositions',
    authentication_middleware.injectJwtData(),
    (request, response, next) => proposition_controller
        .search(request, response)
        .catch(next)
);

api_routes.delete(
    '/campaigns/:campaign_id/propositions/:proposition_id',
    authentication_middleware.injectJwtData(),
    (request, response, next) => proposition_controller
        .delete(request, response)
        .catch(next)
);

module.exports = {
    api_routes,
    url_prefix,
};
