/* istanbul ignore file */

'use strict';

const nodemailer = require('nodemailer');

const fs = require('fs').promises;

const mustache = require('mustache');

const {
    CustomError,
} = require('../CustomError');

const {
    configuration,
} = require('../configuration');

class InvitationService {

    /**
     * Constructor.
     */
    constructor() {
        this.connection = null;
    }


    /* istanbul ignore next */
    /**
     * @static
     * @returns {InvitationService}
     */
    static getInstance() {
        if (InvitationService.instance === null) {
            InvitationService.instance = new InvitationService(
            );
        }
        return InvitationService.instance;
    }

}

InvitationService.instance = null;

module.exports = {
    InvitationService,
};
