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


    // eslint-disable-next-line require-jsdoc
    static get STATUS_DRAFT() {
        return 1;
    }

    // eslint-disable-next-line require-jsdoc
    static get STATUS_IN_PROGRESS() {
        return 2;
    }

    // eslint-disable-next-line require-jsdoc
    static get STATUS_FINISHED() {
        return 3;
    }

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
                proposition_type: {
                    allowNull: true,
                    type: DataTypes.STRING,
                },
                campaign_status: {
                    allowNull: false,
                    type: DataTypes.INTEGER.UNSIGNED,
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
            id,
            id_list,
            campaign_status_list,
            end_date_lte,
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

        if (campaign_status_list !== undefined) {
            where[Op.and].campaign_status = {
                [Op.in]: campaign_status_list,
            };
        }

        if (end_date_lte !== undefined) {
            where[Op.and].end_date = {
                [Op.lte]: end_date_lte,
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
