'use strict';

const {
    Router,
} = require('express');

const api_routes = Router(); // eslint-disable-line new-cap

const url_prefix = '/api/v1';


async function dummyController(request, response) {
    response.status(200).json({ a: 1 });
}


api_routes.get(
    '/info',
    (request, response, next) => dummyController(request, response)
        .catch(next)
);

module.exports = {
    api_routes,
    url_prefix,
};