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

class PropositionRepository extends AbstractSequelizeRepository {

    /**
     * @static
     * @returns {PropositionRepository}
     */
    static getInstance() {
        if (PropositionRepository.instance === null) {
            PropositionRepository.instance = new PropositionRepository(
                PropositionRepository.getModel()
            );
        }

        return PropositionRepository.instance;
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
                payload: {
                    allowNull: false,
                    type: DataTypes.STRING,
                },
                creator_user_id: {
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
                tableName: 'propositions',
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
            campaign_id,
        } = criteria;

        const where = {
            [Op.and]: {},
        };

        if (id_list !== undefined) {
            where[Op.and].id = {
                [Op.in]: id_list,
            };
        }

        if (campaign_id !== undefined) {
            where[Op.and].campaign_id = {
                [Op.eq]: campaign_id,
            };
        }

        return {
            where,
        };
    }
}

PropositionRepository.instance = null;

module.exports = {
    PropositionRepository,
};
