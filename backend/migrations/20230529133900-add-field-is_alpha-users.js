'use strict';

module.exports = {
    down: (query_interface) => query_interface
        .removeColumn(
            'users',
            'is_alpha'
        ),
    up: (query_interface, Sequelize) => query_interface
        .addColumn(
            'users',
            'is_alpha',
            {
                after: 'password',
                allowNull: true,
                defaultValue: null,
                type: Sequelize.BOOLEAN,
            },
            {}
        ),
};
