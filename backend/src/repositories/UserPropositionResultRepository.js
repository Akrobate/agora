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

class UserPropositionResultRepository extends AbstractSequelizeRepository {

    /**
     * @static
     * @returns {UserPropositionResultRepository}
     */
    static getInstance() {
        if (UserPropositionResultRepository.instance === null) {
            UserPropositionResultRepository.instance = new UserPropositionResultRepository(
                UserPropositionResultRepository.getModel()
            );
        }

        return UserPropositionResultRepository.instance;
    }


    /**
     * @returns {Sequelize<Object>}
     */
    static getModel() {
        return sequelize.define(
            'Proposition',
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER.UNSIGNED,
                },
                campaign_id: {
                    allowNull: false,
                    type: DataTypes.INTEGER.UNSIGNED,
                },
                user_id: {
                    allowNull: false,
                    type: DataTypes.INTEGER.UNSIGNED,
                },
                proposition_id: {
                    allowNull: false,
                    type: DataTypes.INTEGER.UNSIGNED,
                },
                rank: {
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
                tableName: 'users_propositions_results',
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
            id_list,
            user_id_list,
            id,
            campaign_id,
            user_id,
            proposition_id,
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

        if (user_id_list !== undefined) {
            where[Op.and].user_id = {
                [Op.in]: user_id_list,
            };
        }

        if (campaign_id !== undefined) {
            where[Op.and].campaign_id = {
                [Op.eq]: campaign_id,
            };
        }

        if (user_id !== undefined) {
            where[Op.and].user_id = {
                [Op.eq]: user_id,
            };
        }

        if (proposition_id !== undefined) {
            where[Op.and].proposition_id = {
                [Op.eq]: proposition_id,
            };
        }

        return {
            where,
        };
    }
}

UserPropositionResultRepository.instance = null;

module.exports = {
    UserPropositionResultRepository,
};
