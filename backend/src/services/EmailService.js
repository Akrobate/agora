/* istanbul ignore file */

'use strict';

const nodemailer = require('nodemailer');
const moment = require('moment');

const fs = require('fs').promises;

const mustache = require('mustache');

const {
    EmailRepository,
} = require('../repositories');

const {
    CustomError,
} = require('../CustomError');

const {
    configuration,
} = require('../configuration');

class EmailService {

    /**
     * @param {EmailRepository} email_repository
     * @returns {EmailService}
     */
    constructor(
        email_repository
    ) {
        this.email_repository = email_repository;

        this.connection = null;
        this.email_sender_running = true;
    }


    /**
     * @returns {String}
     */
    static get TEMPLATES_FOLDER() {
        return `${__dirname}/email_templates/`;
    }


    /**
     * @returns {String}
     */
    static get MAX_DAILY_MAILS_COUNT() {
        return 250;
    }


    /* istanbul ignore next */
    /**
     * @static
     * @returns {EmailService}
     */
    static getInstance() {
        if (EmailService.instance === null) {
            EmailService.instance = new EmailService(
                EmailRepository.getInstance()
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


    /**
     * @param {*} input
     * @param {*} input.to
     * @param {*} input.campaign_name
     * @param {*} input.campaign_description
     * @param {*} input.invitation_token
     * @returns {Promise<Object>}
     */
    async sendForgottenPasswordMail(input) {

        const {
            to,
            forgotten_password_token,
            user_id,
        } = input;

        const frontend_url = configuration.frontend.url;

        const invitation_template = await fs.readFile(
            `${EmailService.TEMPLATES_FOLDER}forgotten-password.html`,
            'utf8'
        );

        const html = mustache
            .render(
                invitation_template,
                {
                    frontend_url,
                    forgotten_password_token,
                    user_id,
                }
            );

        return this.sendMail({
            to_list: [
                to,
            ],
            from_email: 'agora.social.app@gmail.com',
            from_name: 'Agora Social App',
            subject: 'Agora - Mot de passe oublié',
            html,
            text: null,
        });
    }


    /**
     * @param {Object} send_mail_params
     * @return {Promise}
     */
    async createQueuedSendMail(send_mail_params) {
        const {
            to_list,
            from_email,
            from_name,
            from_user_id,
            to_user_id,
            subject,
            html,
            text,
        } = send_mail_params;
        const reponse = await this.email_repository
            .create({
                subject,
                text,
                html,
                email_status: EmailRepository.STATUS_TO_SEND,
                from_user_id,
                from_email,
                from_name,
                to_user_id,
                email_to: to_list.join(', '),
                from: `"${from_name}" <${from_email}>`,
            });

        this.email_sender_running = true;
        return reponse;
    }


    /**
     * Should be called on application UP
     * Should be called on each queuedSendMail
     * @returns {Void}
     */
    async startEmailSender() {
        if (this.email_sender_running === true) {
            return;
        }

        this.email_sender_running = true;
        this.processEmailSender();
    }


    /**
     * @returns {Void}
     */
    async processEmailSender() {
        if (this.email_sender_running === false) {
            return;
        }

        const email_to_send_count = await this.email_repository.count({
            email_status: EmailRepository.STATUS_TO_SEND,
        });

        if (email_to_send_count === 0) {
            this.email_sender_running = false;
            return;
        }

        const email_sent_last_periode_count = await this.email_repository.count({
            email_status: EmailRepository.STATUS_SENT,
            sent_at_lower_boundary: moment().subtract(24, 'hours'),
        });

        if (email_sent_last_periode_count < EmailService.MAX_DAILY_MAILS_COUNT) {
            // SENT A MAIL
        }

        // Wait
        // call processEmailSender again

    }

}

EmailService.instance = null;

module.exports = {
    EmailService,
};
