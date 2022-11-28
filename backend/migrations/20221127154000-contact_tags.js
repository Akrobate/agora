'use strict';

module.exports = {
    down: (query_interface) => query_interface
        .dropTable('contact_tags'),
    up: (query_interface, sequelize) => query_interface
        .createTable(
            'contact_tags',
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: sequelize.INTEGER.UNSIGNED,
                },
                user_id: {
                    allowNull: false,
                    type: sequelize.INTEGER.UNSIGNED,
                    unique: false,
                },
                name: {
                    allowNull: false,
                    type: sequelize.STRING,
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
