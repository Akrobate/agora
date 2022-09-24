'use strict';

const {
    DataTypes,
    Op,
} = require('sequelize');

const {
    sequelize,
} = require('./connections/Sequelize');

const {
    AbstractSequelizeRepository,
} = require('./AbstractSequelizeRepository');

class UserRepository extends AbstractSequelizeRepository {

    /**
     * @static
     * @returns {UserRepository}
     */
    static getInstance() {
        if (UserRepository.instance === null) {
            UserRepository.instance = new UserRepository(
                UserRepository.getModel()
            );
        }

        return UserRepository.instance;
    }


    /**
     * @returns {Sequelize<Object>}
     */
    static getModel() {
        return sequelize.define(
            'User',
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER.UNSIGNED,
                },
                first_name: {
                    allowNull: true,
                    type: DataTypes.STRING,
                },
                last_name: {
                    allowNull: true,
                    type: DataTypes.STRING,
                },
                email: {
                    allowNull: false,
                    type: DataTypes.STRING,
                    unique: true,
                },
                is_verified_email: {
                    allowNull: true,
                    type: DataTypes.BOOLEAN,
                },
                password: {
                    allowNull: true,
                    type: DataTypes.STRING,
                },
                created_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                },
                updated_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                },
            },
            {
                tableName: 'users',
                underscored: true,
                timestamps: false,
            }
        );
    }

    /**
     * @static
     * @param {Object} criteria
     * @returns {Object}
     */
    static _formatCriteria(criteria) {
        const {
            id,
            id_list,
            email,
        } = criteria;

        const where = {
            [Op.and]: {},
        };

        if (id !== undefined) {
            where[Op.and].id = {
                [Op.eq]: id,
            };
        }

        if (id_list !== undefined) {
            where[Op.and].id = {
                [Op.in]: id_list,
            };
        }

        if (email !== undefined) {
            where[Op.and].email = {
                [Op.eq]: email,
            };
        }

        return {
            where,
        };
    }
}

UserRepository.instance = null;

module.exports = {
    UserRepository,
};
