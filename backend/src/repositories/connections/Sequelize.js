'use strict';

const Sequelize = require('sequelize');

const {
    configuration,
} = require('../../configuration');

const sequelize = new Sequelize(
    configuration.storage.mysql.database_name,
    configuration.storage.mysql.username,
    configuration.storage.mysql.password,
    {
        dialect: 'mysql',
        host: configuration.storage.mysql.host,
        logging: undefined,
        port: configuration.storage.mysql.port,
    }
);

module.exports = {
    sequelize,
};
