'use strict';

module.exports = {
    down: (query_interface) => query_interface
        .dropTable('users'),
    up: (query_interface, sequelize) => query_interface
        .createTable(
            'users',
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: sequelize.INTEGER.UNSIGNED,
                },
                first_name: {
                    allowNull: true,
                    type: sequelize.STRING,
                    unique: false,
                },
                last_name: {
                    allowNull: true,
                    type: sequelize.STRING,
                    unique: false,
                },
                password: {
                    allowNull: null,
                    type: sequelize.STRING,
                    unique: false,
                },
                email: {
                    allowNull: false,
                    type: sequelize.STRING,
                    unique: true,
                },
                created_at: {
                    allowNull: false,
                    defaultValue: sequelize.literal('NOW()'),
                    type: sequelize.DATE,
                },
                updated_at: {
                    allowNull: false,
                    defaultValue: sequelize.literal('NOW()'),
                    type: sequelize.DATE,
                },
            },
            {
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        ),
};
