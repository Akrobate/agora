'use strict';

class CustomError extends Error {

    /**
     * @param {Number} code
     * @param {String|Object} message
     */
    constructor(code, message) {
        super(message);
        this.code = code;
        this.message_object = null;
        if (message) {
            if (typeof message === 'object') {
                this.message_object = {
                    message,
                };
            } else {
                this.message_object = {
                    message: this.message,
                };
            }
        }
    }

    /**
     * @returns {Number}
     */
    getCode() {
        return this.code;
    }

    // eslint-disable-next-line require-jsdoc
    static get BAD_PARAMETER() {
        return 1;
    }

    // eslint-disable-next-line require-jsdoc
    static get INTERNAL_ERROR() {
        return 2;
    }

    // eslint-disable-next-line require-jsdoc
    static get NOT_FOUND() {
        return 3;
    }

    // eslint-disable-next-line require-jsdoc
    static get ALREADY_EXISTS() {
        return 4;
    }

}

module.exports = {
    CustomError,
};
