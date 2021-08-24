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

class CampaignUserStatusRepository extends AbstractSequelizeRepository {

    /**
     * @static
     * @returns {CampaignUserStatusRepository}
     */
    static getInstance() {
        if (CampaignUserStatusRepository.instance === null) {
            CampaignUserStatusRepository.instance = new CampaignUserStatusRepository(
                CampaignUserStatusRepository.getModel()
            );
        }

        return CampaignUserStatusRepository.instance;
    }


    /**
     * @returns {Number}
     */
    static get INVITED() {
        return 1;
    }

    /**
     * @returns {Number}
     */
    static get STARTED() {
        return 2;
    }

    /**
     * @returns {Number}
     */
    static get RESULT_SUBMITED() {
        return 3;
    }

    /**
     * @returns {Sequelize<Object>}
     */
    static getModel() {
        return sequelize.define(
            'CampaignUserStatus',
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
                status_id: {
                    allowNull: false,
                    type: DataTypes.INTEGER.UNSIGNED,
                },
                date: {
                    allowNull: false,
                    type: DataTypes.DATE,
                },
                created_at: {
                    allowNull: false,
                    type: DataTypes.DATE,
                },
                updated_at: {
                    allowNull: false,
                    timestamps: false,
                    type: DataTypes.DATE,
                },
            },
            {
                tableName: 'campaigns_users_status',
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
            user_id,
            campaign_id,
            status_id,
            status_id_list,
        } = criteria;


        const where = {
            [Op.and]: {},
        };

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

        if (user_id !== undefined) {
            where[Op.and].user_id = {
                [Op.eq]: user_id,
            };
        }

        if (campaign_id !== undefined) {
            where[Op.and].campaign_id = {
                [Op.eq]: campaign_id,
            };
        }

        if (status_id !== undefined) {
            where[Op.and].status_id = {
                [Op.eq]: status_id,
            };
        }

        if (status_id_list !== undefined) {
            where[Op.and].status_id = {
                [Op.in]: status_id_list,
            };
        }

        return {
            where,
        };
    }


    /**
     * @param {*} input
     * @return {Object}
     */
    async upsertCampaignUserStatus(input) {
        const {
            campaign_id,
            user_id,
            status_id,
            date,
        } = input;

        let campaign_user_status = await this.find({
            campaign_id,
            user_id,
            status_id,
        });

        if (campaign_user_status === null) {
            campaign_user_status = await this.create({
                campaign_id,
                status_id,
                user_id,
                date,
            });
        } else {
            campaign_user_status = await this.update({
                id: campaign_user_status.id,
                campaign_id,
                status_id,
                user_id,
                date,
            });
        }

        return campaign_user_status;

    }
}

CampaignUserStatusRepository.instance = null;

module.exports = {
    CampaignUserStatusRepository,
};
