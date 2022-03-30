'use strict';

const cors = require('cors');
const express = require('express');

const routes = require('./routes');

const {
    error_manager_middleware,
    not_found_error_middleware,
    access_control_allow_middleware,
} = require('./middlewares');

const app = express();
app.use(access_control_allow_middleware);
app.use(express.json());
app.use(express.urlencoded({
    extended: false,
}));

app.use(cors({
    optionsSuccessStatus: 200, /* some legacy browsers (IE11, various SmartTVs) choke on 204 */
}));

app.use(routes.url_prefix, routes.api_routes);

app.use(not_found_error_middleware);
app.use(error_manager_middleware);

module.exports = {
    app,
};
