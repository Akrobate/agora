'use strict';

module.exports = {
    down: (query_interface) => query_interface
        .dropTable('emails'),
    up: (query_interface, sequelize) => query_interface
        .createTable(
            'emails',
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: sequelize.INTEGER.UNSIGNED,
                },
                object: {
                    allowNull: false,
                    type: sequelize.STRING,
                },
                body: {
                    allowNull: false,
                    type: sequelize.STRING,
                },
                email_status: {
                    allowNull: null,
                    type: sequelize.INTEGER.UNSIGNED,
                },
                from_user_id: {
                    allowNull: false,
                    type: sequelize.INTEGER.UNSIGNED,
                },
                to_user_id: {
                    allowNull: false,
                    type: sequelize.INTEGER.UNSIGNED,
                },
                email_to: {
                    allowNull: false,
                    type: sequelize.STRING,
                },
                email_from: {
                    allowNull: false,
                    type: sequelize.STRING,
                },
                send_at: {
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
