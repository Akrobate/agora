'use strict';

module.exports = {
    down: (query_interface) => query_interface
        .dropTable('users_contacts_tags'),
    up: (query_interface, sequelize) => query_interface
        .createTable(
            'users_contacts_tags',
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
                contact_user_id: {
                    allowNull: false,
                    type: sequelize.INTEGER.UNSIGNED,
                    unique: false,
                },
                tag_id: {
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
