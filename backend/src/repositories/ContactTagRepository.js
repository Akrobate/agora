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

class ContactTagRepository extends AbstractSequelizeRepository {

    /**
     * @static
     * @returns {ContactTagRepository}
     */
    static getInstance() {
        if (ContactTagRepository.instance === null) {
            ContactTagRepository.instance = new ContactTagRepository(
                ContactTagRepository.getModel()
            );
        }

        return ContactTagRepository.instance;
    }


    /**
     * @returns {Sequelize<Object>}
     */
    static getModel() {
        return sequelize.define(
            'ContactTag',
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
                name: {
                    allowNull: false,
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
                tableName: 'contact_tags',
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
            user_id,
            user_id_list,
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

        return {
            where,
        };
    }
}

ContactTagRepository.instance = null;

module.exports = {
    ContactTagRepository,
};
