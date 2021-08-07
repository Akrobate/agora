'use strict';

module.exports = {
    down: (query_interface) => query_interface
        .dropTable('campaigns_users_status'),
    up: (query_interface, sequelize) => query_interface
        .createTable(
            'campaigns_users_status',
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
                status_id: {
                    allowNull: false,
                    type: sequelize.INTEGER.UNSIGNED,
                },
                date: {
                    allowNull: false,
                    type: sequelize.DATE,
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
