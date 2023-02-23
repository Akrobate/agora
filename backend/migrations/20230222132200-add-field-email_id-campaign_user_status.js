module.exports = {
    down: (query_interface) => query_interface
        .removeColumn(
            'campaigns_users_status',
            'email_id'
        ),
    up: (query_interface, Sequelize) => query_interface
        .addColumn(
            'campaigns_users_status',
            'email_id',
            {
                after: 'status_id',
                allowNull: true,
                defaultValue: null,
                type: Sequelize.INTEGER.UNSIGNED,
            },
            {}
        ),
};
