'use strict';

const cors = require('cors');
const express = require('express');

const routes = require('./routes');

const {
    error_manager_middleware,
    not_found_error_middleware,
} = require('./middlewares/HttpErrorManager');


const app = express();

// Headers middleware
app.use((request, response, next) => {
    if (request.headers) {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
        response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
        response.header('Access-Control-Allow-Credentials', 'false');
    }
    return next();
});
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
