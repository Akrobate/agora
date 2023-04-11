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
                    allowNull: true,
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
                sent_at: {
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
            email_status,
            email_status_list,
            from_user_id,
            from_user_id_list,
            to_user_id,
            to_user_id_list,
            sent_at_upper_boundary,
            sent_at_lower_boundary,
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

        if (email_status !== undefined) {
            where[Op.and].email_status = {
                [Op.eq]: email_status,
            };
        }

        if (email_status_list !== undefined) {
            where[Op.and].email_status = {
                [Op.in]: email_status_list,
            };
        }

        if (from_user_id !== undefined) {
            where[Op.and].from_user_id = {
                [Op.eq]: from_user_id,
            };
        }

        if (from_user_id_list !== undefined) {
            where[Op.and].from_user_id = {
                [Op.in]: from_user_id_list,
            };
        }

        if (to_user_id !== undefined) {
            where[Op.and].to_user_id = {
                [Op.eq]: to_user_id,
            };
        }

        if (to_user_id_list !== undefined) {
            where[Op.and].to_user_id = {
                [Op.in]: to_user_id_list,
            };
        }

        // @todo: Need to be tester
        if (sent_at_upper_boundary !== undefined) {
            where[Op.and].sent_at = {
                [Op.lte]: sent_at_upper_boundary,
            };
        }

        if (sent_at_lower_boundary !== undefined) {
            where[Op.and].sent_at = {
                [Op.gte]: sent_at_lower_boundary,
            };
        }

        return {
            where,
        };
    }


    /**
     * @param {Number} email_id
     * @returns {Promise}
     */
    updateEmailSent(email_id) {
        return this.update({
            id: email_id,
            email_status: EmailRepository.STATUS_SENT,
            sent_at: new Date(),
        });
    }


    /**
     * @param {Number} email_id
     * @returns {Promise}
     */
    countToSendEmails() {
        return this.countEmailsByEmailStatus(EmailRepository.STATUS_TO_SEND);
    }


    /**
     * @param {Number} email_status
     * @returns {Promise<Number>}
     */
    countEmailsByEmailStatus(email_status) {
        return this.count({
            email_status,
        });
    }

}

EmailRepository.instance = null;

module.exports = {
    EmailRepository,
};
