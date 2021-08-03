'use strict';

module.exports = {
    down: (query_interface) => query_interface
        .dropTable('campaigns_users'),
    up: (query_interface, sequelize) => query_interface
        .createTable(
            'campaigns_users',
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: sequelize.INTEGER.UNSIGNED,
                },
                campaign_id: {
                    allowNull: false,
                    type: sequelize.INTEGER.UNSIGNED,
                },
                user_id: {
                    allowNull: false,
                    type: sequelize.INTEGER.UNSIGNED,
                },
                public_token: {
                    allowNull: false,
                    type: sequelize.STRING,
                },
                access_level: {
                    allowNull: false,
                    type: sequelize.INTEGER.UNSIGNED,
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
