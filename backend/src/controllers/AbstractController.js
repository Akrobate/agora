'use strict';

const {
    CustomError,
} = require('../CustomError');

class AbstractController {

    /**
     * @param {Object} error
     * @returns {void}
     */
    checkValidationError(error) {
        if (error) {
            throw new CustomError(CustomError.BAD_PARAMETER, error.message);
        }
    }
}

module.exports = {
    AbstractController,
};
