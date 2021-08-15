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

class CampaignUserRepository extends AbstractSequelizeRepository {

    /**
     * @static
     * @returns {CampaignUserRepository}
     */
    static getInstance() {
        if (CampaignUserRepository.instance === null) {
            CampaignUserRepository.instance = new CampaignUserRepository(
                CampaignUserRepository.getModel()
            );
        }

        return CampaignUserRepository.instance;
    }

    /**
     * @returns {Number}
     */
    static get GUEST() {
        return 1;
    }

    /**
     * @returns {Number}
     */
    static get OBSERVER() {
        return 2;
    }

    /**
     * @returns {Number}
     */
    static get MANAGER() {
        return 3;
    }


    /**
     * @returns {Sequelize<Object>}
     */
    static getModel() {
        return sequelize.define(
            'CampaignUser',
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
                public_token: {
                    allowNull: true,
                    defaultValue: null,
                    type: DataTypes.STRING,
                },
                access_level: {
                    allowNull: false,
                    type: DataTypes.INTEGER.UNSIGNED,
                },
                is_participant: {
                    allowNull: false,
                    defaultValue: true,
                    type: DataTypes.BOOLEAN,
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
                tableName: 'campaigns_users',
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
            campaign_id,
            access_level,
            public_token,
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

        if (campaign_id !== undefined) {
            where[Op.and].campaign_id = {
                [Op.eq]: campaign_id,
            };
        }

        if (access_level !== undefined) {
            where[Op.and].access_level = {
                [Op.eq]: access_level,
            };
        }

        if (public_token !== undefined) {
            where[Op.and].public_token = {
                [Op.eq]: public_token,
            };
        }

        return {
            where,
        };
    }
}

CampaignUserRepository.instance = null;

module.exports = {
    CampaignUserRepository,
};
