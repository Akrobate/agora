'use strict';

const { 
    configuration,
} = require('./configuration');

module.exports = {
    database: configuration.storage.mysql.database_name,
    dialect: 'mysql',
    host: configuration.storage.mysql.host,
    password: configuration.storage.mysql.password,
    port: configuration.storage.mysql.port,
    username: configuration.storage.mysql.username,
};