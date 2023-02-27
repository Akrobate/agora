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

class EmailRepository extends AbstractSequelizeRepository {


    // eslint-disable-next-line require-jsdoc
    static get STATUS_SENT() {
        return 1;
    }

    // eslint-disable-next-line require-jsdoc
    static get STATUS_TO_SEND() {
        return 2;
    }

    /**
     * @static
     * @returns {EmailRepository}
     */
    static getInstance() {
        if (EmailRepository.instance === null) {
            EmailRepository.instance = new EmailRepository(
                EmailRepository.getModel()
            );
        }

        return EmailRepository.instance;
    }


    /**
     * @returns {Sequelize<Object>}
     */
    static getModel() {
        return sequelize.define(
            'Email',
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER.UNSIGNED,
                },
                subject: {
                    allowNull: false,
                    type: DataTypes.STRING,
                },
                html: {
                    allowNull: true,
                    type: DataTypes.STRING,
                },
                text: {
                    allowNull: true,
                    type: DataTypes.STRING,
                },
                email_status: {
                    allowNull: false,
                    type: DataTypes.INTEGER.UNSIGNED,
                },
                from_user_id: {
                    allowNull: false,
                    type: DataTypes.INTEGER.UNSIGNED,
                },
                to_user_id: {
                    allowNull: false,
                    type: DataTypes.INTEGER.UNSIGNED,
                },
                email_to: {
                    allowNull: false,
                    type: DataTypes.STRING,
                },
                from_name: {
                    allowNull: false,
                    type: DataTypes.STRING,
                },
                from_email: {
                    allowNull: false,
                    type: DataTypes.STRING,
                },
                send_at: {
                    allowNull: true,
                    type: DataTypes.DATE,
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
                tableName: 'emails',
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
            end_date_upper_boundary,
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

        if (end_date_upper_boundary !== undefined) {
            where[Op.and].end_date = {
                [Op.lte]: end_date_upper_boundary,
            };
        }

        return {
            where,
        };
    }
}

EmailRepository.instance = null;

module.exports = {
    EmailRepository,
};
