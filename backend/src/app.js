'use strict';

const express = require('express');
const routes = require('./routes');

const {
    error_manager_middleware,
    not_found_error_middleware,
    access_control_allow_middleware,
    express_urlencoded_middleware,
    cors_middleware,
    express_json,
} = require('./middlewares');

const app = express();
app.disable('x-powered-by');

app.use(access_control_allow_middleware);
app.use(express_json);
app.use(express_urlencoded_middleware);
app.use(cors_middleware);

app.use(routes.url_prefix, routes.api_routes);

app.use(not_found_error_middleware);
app.use(error_manager_middleware);

module.exports = {
    app,
};
