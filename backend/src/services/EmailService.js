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

class EmailService {

    /**
     * Constructor.
     */
    constructor() {
        this.connection = null;
    }


    /**
     * @returns {String}
     */
    static get TEMPLATES_FOLDER() {
        return `${__dirname}/email_templates/`;
    }

    /* istanbul ignore next */
    /**
     * @static
     * @returns {EmailService}
     */
    static getInstance() {
        if (EmailService.instance === null) {
            EmailService.instance = new EmailService(
            );
        }
        return EmailService.instance;
    }


    /**
     * @returns {Promise<Object>}
     */
    async createConnection() {
        let connection = null;
        try {
            connection = nodemailer.createTransport({
                host: configuration.email.host,
                port: configuration.email.port,
                auth: {
                    user: configuration.email.username,
                    pass: configuration.email.password,
                },
            });

            const response = await connection.verify();

            if (response !== true) {
                throw new CustomError(CustomError.INTERNAL_ERROR, 'Connection mailer not etablished');
            }
        } catch (error) {
            throw new CustomError(CustomError.INTERNAL_ERROR, error.message);
        }

        return connection;
    }


    /**
     * @returns {Promise<Object>}
     */
    async getConnectionInstance() {
        if (this.connection === null) {
            this.connection = await this.createConnection();
        }
        return this.connection;
    }


    /**
     * @param {Object} input
     * @returns {Promise<Object>}
     */
    async sendMail(input) {
        const {
            to_list,
            from_email,
            from_name,
            subject,
            html,
            text,
        } = input;

        const connection = await this.getConnectionInstance();
        return connection
            .sendMail({
                from: `"${from_name}" <${from_email}>`,
                to: to_list.join(', '),
                subject,
                text,
                html,
            });
    }


    /**
     * @param {*} input
     * @param {*} input.to
     * @param {*} input.campaign_name
     * @param {*} input.campaign_description
     * @param {*} input.invitation_token
     * @returns {Promise<Object>}
     */
    async sendInvitationMail(input) {

        const {
            to,
            campaign_name,
            campaign_description,
            invitation_token,
        } = input;

        const frontend_url = configuration.frontend.url;

        const invitation_template = await fs.readFile(
            `${EmailService.TEMPLATES_FOLDER}invitation.html`,
            'utf8'
        );

        const html = mustache
            .render(
                invitation_template,
                {
                    to,
                    campaign_name,
                    campaign_description,
                    invitation_token,
                    frontend_url,
                }
            );

        return this.sendMail({
            to_list: [
                to,
            ],
            from_email: 'agora.social.app@gmail.com',
            from_name: 'Agora Social App',
            subject: 'Votre avis a été sollicité sur agora social',
            html,
            text: null,
        });
    }

}

EmailService.instance = null;

module.exports = {
    EmailService,
};
