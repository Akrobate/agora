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

class UserPropositionEloResultRepository extends AbstractSequelizeRepository {

    /**
     * @static
     * @returns {UserPropositionEloResultRepository}
     */
    static getInstance() {
        if (UserPropositionEloResultRepository.instance === null) {
            UserPropositionEloResultRepository.instance = new UserPropositionEloResultRepository(
                UserPropositionEloResultRepository.getModel()
            );
        }

        return UserPropositionEloResultRepository.instance;
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
                elo_score: {
                    allowNull: false,
                    type: DataTypes.INTEGER.UNSIGNED,
                },
                display_count: {
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
                tableName: 'users_propositions_elo_results',
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
            proposition_id,
            campaign_id,
            user_id,
            id_list,
            proposition_id_list,
        } = criteria;

        const where = {
            [Op.and]: {},
        };

        if (id !== undefined) {
            where[Op.and].id = {
                [Op.eq]: id,
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

        if (id_list !== undefined) {
            where[Op.and].id = {
                [Op.in]: id_list,
            };
        }

        if (proposition_id_list !== undefined) {
            where[Op.and].proposition_id = {
                [Op.in]: proposition_id_list,
            };
        }

        return {
            where,
        };
    }
}

UserPropositionEloResultRepository.instance = null;

module.exports = {
    UserPropositionEloResultRepository,
};
