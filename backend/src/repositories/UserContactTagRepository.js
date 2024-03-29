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

class UserContactTagRepository extends AbstractSequelizeRepository {

    /**
     * @static
     * @returns {UserContactTagRepository}
     */
    static getInstance() {
        if (UserContactTagRepository.instance === null) {
            UserContactTagRepository.instance = new UserContactTagRepository(
                UserContactTagRepository.getModel()
            );
        }

        return UserContactTagRepository.instance;
    }


    /**
     * @returns {Sequelize<Object>}
     */
    static getModel() {
        return sequelize.define(
            'UserContactTag',
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER.UNSIGNED,
                },
                user_id: {
                    allowNull: true,
                    type: DataTypes.INTEGER.UNSIGNED,
                },
                contact_user_id: {
                    allowNull: false,
                    type: DataTypes.INTEGER.UNSIGNED,
                },
                tag_id: {
                    allowNull: false,
                    type: DataTypes.INTEGER.UNSIGNED,
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
                tableName: 'users_contacts_tags',
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
            contact_user_id,
            contact_user_id_list,
            user_id,
            user_id_list,
            tag_id,
            tag_id_list,
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

        if (contact_user_id !== undefined) {
            where[Op.and].contact_user_id = {
                [Op.eq]: contact_user_id,
            };
        }

        if (contact_user_id_list !== undefined) {
            where[Op.and].contact_user_id = {
                [Op.in]: contact_user_id_list,
            };
        }

        if (user_id !== undefined) {
            where[Op.and].user_id = {
                [Op.eq]: user_id,
            };
        }

        if (user_id_list !== undefined) {
            where[Op.and].user_id = {
                [Op.in]: user_id_list,
            };
        }

        if (tag_id !== undefined) {
            where[Op.and].tag_id = {
                [Op.eq]: tag_id,
            };
        }

        if (tag_id_list !== undefined) {
            where[Op.and].tag_id = {
                [Op.in]: tag_id_list,
            };
        }

        return {
            where,
        };
    }
}

UserContactTagRepository.instance = null;

module.exports = {
    UserContactTagRepository,
};
