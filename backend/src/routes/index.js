'use strict';

const {
    Router,
} = require('express');

const {
    UserController,
    CampaignController,
    CampaignUserController,
    PropositionController,
    CampaignUserStatusController,
    UserPropositionController,
    UserEloPropositionController,
    InvitationController,
    ContactTagController,
    UserContactController,
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
const campaign_user_status_controller = CampaignUserStatusController.getInstance();
const user_proposition_controller = UserPropositionController.getInstance();
const user_elo_proposition_controller = UserEloPropositionController.getInstance();
const invitation_controller = InvitationController.getInstance();
const contact_tag_controller = ContactTagController.getInstance();
const user_contact_controller = UserContactController.getInstance();


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
    '/users/forgotten-password',
    (request, response, next) => user_controller
        .forgottenPassword(request, response)
        .catch(next)
);

api_routes.post(
    '/users/login/guest',
    (request, response, next) => user_controller
        .loginGuest(request, response)
        .catch(next)
);

api_routes.post(
    '/users/token/renew',
    authentication_middleware.injectJwtData(),
    (request, response, next) => user_controller
        .renewToken(request, response)
        .catch(next)
);

api_routes.patch(
    '/users/:user_id(\\d+)/',
    authentication_middleware.injectJwtData(),
    (request, response, next) => user_controller
        .update(request, response)
        .catch(next)
);

api_routes.patch(
    '/users/:user_id(\\d+)/password',
    authentication_middleware.injectJwtData(),
    (request, response, next) => user_controller
        .updatePassword(request, response)
        .catch(next)
);

api_routes.patch(
    '/users/:user_id(\\d+)/forgotten-password',
    (request, response, next) => user_controller
        .updateForgottenPassword(request, response)
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

api_routes.get(
    '/campaigns',
    authentication_middleware.injectJwtData(),
    (request, response, next) => campaign_controller
        .search(request, response)
        .catch(next)
);

api_routes.get(
    '/campaigns/:campaign_id',
    authentication_middleware.injectJwtData(),
    (request, response, next) => campaign_controller
        .read(request, response)
        .catch(next)
);

api_routes.patch(
    '/campaigns/:campaign_id',
    authentication_middleware.injectJwtData(),
    (request, response, next) => campaign_controller
        .update(request, response)
        .catch(next)
);

api_routes.delete(
    '/campaigns/:campaign_id',
    authentication_middleware.injectJwtData(),
    (request, response, next) => campaign_controller
        .delete(request, response)
        .catch(next)
);

api_routes.get(
    '/campaigns/:campaign_id/proposition-results',
    authentication_middleware.injectJwtData(),
    (request, response, next) => user_proposition_controller
        .getPropositionResult(request, response)
        .catch(next)
);

api_routes.get(
    '/campaigns/:campaign_id/users',
    authentication_middleware.injectJwtData(),
    (request, response, next) => campaign_user_controller
        .searchCampaignUsers(request, response)
        .catch(next)
);

api_routes.post(
    '/campaigns/:campaign_id/users',
    authentication_middleware.injectJwtData(),
    (request, response, next) => campaign_user_controller
        .addUserToCampaign(request, response)
        .catch(next)
);

api_routes.patch(
    '/campaigns/:campaign_id/users/:campaign_user_id',
    authentication_middleware.injectJwtData(),
    (request, response, next) => campaign_user_controller
        .updateCampaignUser(request, response)
        .catch(next)
);

api_routes.delete(
    '/campaigns/:campaign_id/users/:campaign_user_id',
    authentication_middleware.injectJwtData(),
    (request, response, next) => campaign_user_controller
        .removeCampaignUser(request, response)
        .catch(next)
);


api_routes.post(
    '/campaigns/:campaign_id/users/:campaign_user_id/invite',
    authentication_middleware.injectJwtData(),
    (request, response, next) => invitation_controller
        .sendCampaignUserInvitation(request, response)
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
    '/campaigns/:campaign_id/propositions',
    authentication_middleware.injectJwtData(),
    (request, response, next) => proposition_controller
        .search(request, response)
        .catch(next)
);

api_routes.get(
    '/campaigns/:campaign_id/propositions/:proposition_id',
    authentication_middleware.injectJwtData(),
    (request, response, next) => proposition_controller
        .read(request, response)
        .catch(next)
);

api_routes.delete(
    '/campaigns/:campaign_id/propositions/:proposition_id',
    authentication_middleware.injectJwtData(),
    (request, response, next) => proposition_controller
        .delete(request, response)
        .catch(next)
);

api_routes.patch(
    '/campaigns/:campaign_id/propositions/:proposition_id',
    authentication_middleware.injectJwtData(),
    (request, response, next) => proposition_controller
        .update(request, response)
        .catch(next)
);

api_routes.post(
    '/campaigns/:campaign_id/status',
    authentication_middleware.injectJwtData(),
    (request, response, next) => campaign_user_status_controller
        .upsertStatus(request, response)
        .catch(next)
);

api_routes.get(
    '/campaigns/:campaign_id/status',
    authentication_middleware.injectJwtData(),
    (request, response, next) => campaign_user_status_controller
        .getCampaignStatus(request, response)
        .catch(next)
);

api_routes.post(
    '/campaigns/:campaign_id/init-ranking',
    authentication_middleware.injectJwtData(),
    (request, response, next) => user_proposition_controller
        .initRanking(request, response)
        .catch(next)
);

api_routes.post(
    '/campaigns/:campaign_id/update-ranking',
    authentication_middleware.injectJwtData(),
    (request, response, next) => user_proposition_controller
        .updateRanking(request, response)
        .catch(next)
);

api_routes.get(
    '/campaigns/:campaign_id/own-proposition-results',
    authentication_middleware.injectJwtData(),
    (request, response, next) => user_proposition_controller
        .getOwnResult(request, response)
        .catch(next)
);


api_routes.post(
    '/campaigns/:campaign_id/init-elo-ranking',
    authentication_middleware.injectJwtData(),
    (request, response, next) => user_elo_proposition_controller
        .initEloRanking(request, response)
        .catch(next)
);

api_routes.post(
    '/campaigns/:campaign_id/elo-duel-result',
    authentication_middleware.injectJwtData(),
    (request, response, next) => user_elo_proposition_controller
        .processEloDuelResult(request, response)
        .catch(next)
);

api_routes.get(
    '/campaigns/:campaign_id/elo-ranking',
    authentication_middleware.injectJwtData(),
    (request, response, next) => user_elo_proposition_controller
        .getEloRanking(request, response)
        .catch(next)
);

api_routes.get(
    '/campaigns/:campaign_id/elo-random-propositions',
    authentication_middleware.injectJwtData(),
    (request, response, next) => user_elo_proposition_controller
        .randomPropositions(request, response)
        .catch(next)
);

// Users contacts tags management

api_routes.get(
    '/contacts/tags',
    authentication_middleware.injectJwtData(),
    (request, response, next) => contact_tag_controller
        .search(request, response)
        .catch(next)
);

api_routes.post(
    '/contacts/tags',
    authentication_middleware.injectJwtData(),
    (request, response, next) => contact_tag_controller
        .create(request, response)
        .catch(next)
);

api_routes.get(
    '/contacts/tags/:tag_id',
    authentication_middleware.injectJwtData(),
    (request, response, next) => contact_tag_controller
        .read(request, response)
        .catch(next)
);

api_routes.patch(
    '/contacts/tags/:tag_id',
    authentication_middleware.injectJwtData(),
    (request, response, next) => contact_tag_controller
        .update(request, response)
        .catch(next)
);

api_routes.delete(
    '/contacts/tags/:tag_id',
    authentication_middleware.injectJwtData(),
    (request, response, next) => contact_tag_controller
        .delete(request, response)
        .catch(next)
);

api_routes.post(
    '/contacts',
    authentication_middleware.injectJwtData(),
    (request, response, next) => user_contact_controller
        .replace(request, response)
        .catch(next)
);

api_routes.patch(
    '/contacts',
    authentication_middleware.injectJwtData(),
    (request, response, next) => user_contact_controller
        .add(request, response)
        .catch(next)
);

api_routes.delete(
    '/contacts',
    authentication_middleware.injectJwtData(),
    (request, response, next) => user_contact_controller
        .delete(request, response)
        .catch(next)
);

api_routes.get(
    '/contacts',
    authentication_middleware.injectJwtData(),
    (request, response, next) => user_contact_controller
        .search(request, response)
        .catch(next)
);

module.exports = {
    api_routes,
    url_prefix,
};
