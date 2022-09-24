'use strict';

module.exports = {
    down: (query_interface) => query_interface
        .removeColumn(
            'users',
            'is_verified_email'
        ),
    up: (query_interface, Sequelize) => query_interface
        .addColumn(
            'users',
            'is_verified_email',
            {
                after: 'email',
                allowNull: true,
                defaultValue: null,
                type: Sequelize.BOOLEAN,
            },
            {}
        ),
};
