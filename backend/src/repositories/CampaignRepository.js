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

class CampaignRepository extends AbstractSequelizeRepository {

    /**
     * @static
     * @returns {CampaignRepository}
     */
    static getInstance() {
        if (CampaignRepository.instance === null) {
            CampaignRepository.instance = new CampaignRepository(
                CampaignRepository.getModel()
            );
        }

        return CampaignRepository.instance;
    }


    /**
     * @returns {Sequelize<Object>}
     */
    static getModel() {
        return sequelize.define(
            'Campaign',
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER.UNSIGNED,
                },
                title: {
                    allowNull: false,
                    type: DataTypes.STRING,
                },
                description: {
                    allowNull: true,
                    type: DataTypes.STRING,
                },
                start_date: {
                    allowNull: true,
                    type: DataTypes.DATE,
                },
                end_date: {
                    allowNull: true,
                    type: DataTypes.DATE,
                },
                owner_user_id: {
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
                tableName: 'campaigns',
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
        } = criteria;

        const where = {
            [Op.and]: {},
        };

        if (id_list !== undefined) {
            where[Op.and].id = {
                [Op.in]: id_list,
            };
        }

        return {
            where,
        };
    }
}

CampaignRepository.instance = null;

module.exports = {
    CampaignRepository,
};
