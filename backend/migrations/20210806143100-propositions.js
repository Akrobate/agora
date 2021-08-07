'use strict';

module.exports = {
    down: (query_interface) => query_interface
        .dropTable('propositions'),
    up: (query_interface, sequelize) => query_interface
        .createTable(
            'propositions',
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
                    unique: false,
                },
                payload: {
                    allowNull: false,
                    type: sequelize.STRING,
                    unique: false,
                },
                creator_user_id: {
                    allowNull: false,
                    type: sequelize.INTEGER.UNSIGNED,
                    unique: false,
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
