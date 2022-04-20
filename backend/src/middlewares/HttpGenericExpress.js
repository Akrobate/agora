'use strict';

const express = require('express');
const cors = require('cors');
const status = require('http-status');

const cors_middleware = cors({
    optionsSuccessStatus: status.OK, /* some legacy browsers (IE11, various SmartTVs) choke on 204 */
});

const express_urlencoded_middleware = express.urlencoded({
    extended: false,
});

const express_json = express.json();

module.exports = {
    cors_middleware,
    express_urlencoded_middleware,
    express_json,
};
