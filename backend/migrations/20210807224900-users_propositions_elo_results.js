'use strict';

module.exports = {
    down: (query_interface) => query_interface
        .dropTable('users_propositions_elo_results'),
    up: (query_interface, sequelize) => query_interface
        .createTable(
            'users_propositions_elo_results',
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
                proposition_id: {
                    allowNull: false,
                    type: sequelize.INTEGER.UNSIGNED,
                },
                elo_score: {
                    allowNull: false,
                    type: sequelize.INTEGER.UNSIGNED,
                },
                display_count: {
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
