/* istanbul ignore file */

'use strict';

const moment = require('moment');

const {
    CustomError,
} = require('../CustomError');

class AbstractSequelizeRepository {

    /**
     *
     * @param {SequelizeModel} sequelize_model
     */
    constructor(
        sequelize_model
    ) {
        this.sequelize_model = sequelize_model;
    }


    /**
     * @static
     * @param {SequelizeEntity} sequelize_entity
     * @returns {AbstractIEntity}
     */
    static _formatOutput(sequelize_entity) {
        const entity = sequelize_entity.toJSON();

        Object.keys(entity).forEach((key) => {
            if (moment.isDate(entity[key])) {
                entity[key] = moment(entity[key]);
            }
        });

        return entity;
    }


    /* istanbul ignore next */
    /**
     * @static
     * @param {Object} criteria
     * @throws {CustomError}
     * @returns {null}
     */
    static _formatCriteria(criteria) { // eslint-disable-line no-unused-vars
        throw new CustomError(
            CustomError.ORM_ERROR,
            'Method _formatCriteria must be overriden in child'
        );
    }


    /**
     * @static
     * @param {String[]} sort
     * @returns {Object}
     */
    static _formatSort(sort) {
        return sort.map((sort_string) => {
            if (sort_string.startsWith('-') === true) {
                return [
                    sort_string.substring(1),
                    'DESC',
                ];
            }

            return [
                sort_string,
                'ASC',
            ];
        });
    }

    /**
     * Transforms options (limit, offset, sort) into correct sequelize options.
     * @static
     * @param {Object} options
     * @param {Number} [options.limit]
     * @param {Number} [options.offset]
     * @param {Array<String>} [options.sort_list]
     * @returns {Object}
     */
    static _formatOptions(options) {
        const {
            limit,
            offset,
            sort_list,
        } = options;

        const result = {};

        if (limit !== undefined) {
            result.limit = limit;
        }

        if (offset !== undefined) {
            result.offset = offset;
        }

        if (sort_list !== undefined) {
            result.order = AbstractSequelizeRepository._formatSort(sort_list);
        }

        return result;
    }


    /**
     * @param {Object} input
     * @returns {Promise}
     * @throws {CustomError}
     */
    async create(input) {
        let object = null;
        const data = AbstractSequelizeRepository.enrichDataWithTechnicalDates(input);
        try {
            const sequelize_entity = await this.sequelize_model.create(data);
            object = AbstractSequelizeRepository._formatOutput(sequelize_entity);
        } catch (error) {
            throw new CustomError(
                CustomError.ORM_ERROR,
                error.message
            );
        }
        return object;
    }


    /**
     * Enrich input with created_at and updated at
     * @param {*} input
     * @returns {Object}
     */
    static enrichDataWithTechnicalDates(input) {
        return {
            created_at: moment().toDate(),
            updated_at: moment().toDate(),
            ...input,
        };
    }


    /**
     * @param {Number} id
     * @returns {Promise<AbstractIEntity>}
     * @throws {CustomError}
     */
    async read(id) {
        let object = null;
        try {
            const sequelize_entity = await this.sequelize_model.findByPk(id);
            if (sequelize_entity === null) {
                throw new CustomError(
                    CustomError.NOT_FOUND,
                    `No object found with id ${id}`
                );
            }
            object = AbstractSequelizeRepository._formatOutput(sequelize_entity);
        } catch (error) {
            throw new CustomError(
                error.code ? error.code : CustomError.ORM_ERROR,
                error.message
            );
        }
        return object;
    }


    /**
     * @param {Object} input
     * @returns {Promise<AbstractIEntity>}
     * @throws {CustomError}
     */
    async update(input) {
        let object = null;
        try {
            const sequelize_entity = await this.sequelize_model.findByPk(input.id);
            if (sequelize_entity === null) {
                throw new CustomError(
                    CustomError.NOT_FOUND,
                    `No object found with id ${input.id}`
                );
            }
            await sequelize_entity
                .set({
                    updated_at: moment().toDate(),
                    ...input,
                })
                .save();
            object = AbstractSequelizeRepository._formatOutput(sequelize_entity);
        } catch (error) {
            throw new CustomError(
                error.code ? error.code : CustomError.ORM_ERROR,
                error.message
            );
        }
        return object;
    }


    /**
     * @param {Number} id
     * @returns {Promise<void>}
     * @throws {CustomError}
     */
    async delete(id) {
        let result = null;
        try {
            const sequelize_entity = await this.sequelize_model.findByPk(id);
            if (sequelize_entity === null) {
                throw new CustomError(
                    CustomError.NOT_FOUND,
                    `No object found with id ${id}`
                );
            }
            result = await sequelize_entity.destroy();
        } catch (error) {
            throw new CustomError(
                CustomError.ORM_ERROR,
                error.message
            );
        }
        return result;
    }


    /**
     * @param {Object} [criteria = {}]
     * @param {Object} [options = {}]
     * @param {Number} [options.limit]
     * @param {Number} [options.offset]
     * @param {String[]} [options.sort]
     * @returns {Promise<AbstractIEntity|Error>}
     */
    async find(criteria = {}, options = {}) {
        let result = null;
        try {
            const sequelize_entity = await this.sequelize_model.findOne({
                ...this.constructor._formatCriteria(criteria),
                ...AbstractSequelizeRepository._formatOptions(options),
            });
            if (sequelize_entity !== null) {
                result = AbstractSequelizeRepository._formatOutput(sequelize_entity);
            }
        } catch (error) {
            throw new CustomError(CustomError.INTERNAL_ERROR, error.message);
        }

        return result;
    }


    /**
     * @param {Object} criteria
     * @param {Object} options
     * @param {Number} options.limit
     * @param {Number} options.offset
     * @param {String[]} options.sort
     *
     * @returns {Promise<AbstractIEntity[]|Error>}
     */
    async search(
        criteria = {},
        options = {}
    ) {
        let object_list = [];
        try {
            const sequelize_entity_list = await this.sequelize_model.findAll({
                ...this.constructor._formatCriteria(criteria),
                ...this.constructor._formatOptions(options),
            });
            object_list = sequelize_entity_list.map(
                (sequelize_entity) => AbstractSequelizeRepository._formatOutput(sequelize_entity)
            );

        } catch (error) {
            throw new CustomError(
                CustomError.INTERNAL_ERROR,
                error.message
            );
        }

        return object_list;
    }


    /**
     * @param {Object} criteria
     *
     * @returns {Promise<AbstractIEntity[]|Error>}
     */
    async count(criteria = {}) {
        let sequelize_entity_count;
        try {
            sequelize_entity_count = await this.sequelize_model.count({
                ...this.constructor._formatCriteria(criteria),
            });
        } catch (error) {
            throw new CustomError(
                CustomError.INTERNAL_ERROR,
                error.message
            );
        }

        return sequelize_entity_count;
    }


    /**
     * @param {*} value
     * @returns {Boolean}
     */
    static formatBoolean(value) {
        if (value === undefined || value === null) {
            return value;
        }

        if (typeof value === 'string') {
            return (value === 'true');
        }

        return value;
    }

}

module.exports = {
    AbstractSequelizeRepository,
};
