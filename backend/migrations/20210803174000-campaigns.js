'use strict';

module.exports = {
    down: (query_interface) => query_interface
        .dropTable('campaigns'),
    up: (query_interface, sequelize) => query_interface
        .createTable(
            'campaigns',
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: sequelize.INTEGER.UNSIGNED,
                },
                title: {
                    allowNull: false,
                    type: sequelize.STRING,
                    unique: false,
                },
                description: {
                    allowNull: true,
                    type: sequelize.STRING,
                    unique: false,
                },
                campaign_status: {
                    allowNull: false,
                    type: sequelize.INTEGER.UNSIGNED,
                },
                start_date: {
                    allowNull: true,
                    type: sequelize.DATE,
                },
                end_date: {
                    allowNull: true,
                    type: sequelize.DATE,
                },
                owner_user_id: {
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
