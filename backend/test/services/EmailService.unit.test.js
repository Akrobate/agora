'use strict';

const {
    DataSeeder,
} = require('../test_helpers/DataSeeder');
const {
    expect,
} = require('chai');

const {
    EmailService,
} = require('../../src/services');
const {
    EmailRepository,
} = require('../../src/repositories');
const moment = require('moment');

describe('EmailService unit tests', () => {

    const email_repository = EmailRepository.getInstance();


    beforeEach(async () => {
        await DataSeeder.truncate('EmailRepository');
    });

    it('Should be able to enqueue email', async () => {
        const email_service = EmailService.getInstance();
        const create_data = {
            to_list: [
                'to_toto@test.com',
                'to_toto@test2.com',
            ],
            from_email: 'from_email@test.com',
            from_name: 'FromEmailLabel',
            from_user_id: 122,
            to_user_id: 123,
            subject: 'Email subject',
            html: '<p>Html content</p>',
            text: 'Text content',
        };
        const email_data = await email_service.createQueuedSendMail(create_data);
        expect(email_data).to.have.property('id');
        const {
            id,
        } = email_data;
        const [
            saved_data,
        ] = await email_repository.search({
            id,
        });
        expect(saved_data).to.have.property('id', id);
        expect(saved_data).to.have.property('email_to', create_data.to_list.join(', '));
        expect(saved_data).to.have.property('from_email', create_data.from_email);
        expect(saved_data).to.have.property('from_name', create_data.from_name);
        expect(saved_data).to.have.property('from_user_id', create_data.from_user_id);
        expect(saved_data).to.have.property('to_user_id', create_data.to_user_id);
        expect(saved_data).to.have.property('subject', create_data.subject);
        expect(saved_data).to.have.property('html', create_data.html);
        expect(saved_data).to.have.property('text', create_data.text);
        expect(saved_data).to.have.property('sent_at', null);
        expect(saved_data).to.have.property('email_status', EmailRepository.STATUS_TO_SEND);
    });


    it('Should be able to update sent email', async () => {
        const email_service = EmailService.getInstance();
        const create_data = {
            to_list: [
                'to_toto@test.com',
                'to_toto@test2.com',
            ],
            from_email: 'from_email@test.com',
            from_name: 'FromEmailLabel',
            from_user_id: 122,
            to_user_id: 123,
            subject: 'Email subject',
            html: '<p>Html content</p>',
            text: 'Text content',
        };
        const email_data = await email_service.createQueuedSendMail(create_data);
        expect(email_data).to.have.property('id');
        const {
            id,
        } = email_data;
        const [
            saved_data,
        ] = await email_repository.search({
            id,
        });
        expect(saved_data).to.have.property('id', id);
        expect(saved_data).to.have.property('email_to', create_data.to_list.join(', '));
        expect(saved_data).to.have.property('from_email', create_data.from_email);
        expect(saved_data).to.have.property('from_name', create_data.from_name);
        expect(saved_data).to.have.property('from_user_id', create_data.from_user_id);
        expect(saved_data).to.have.property('to_user_id', create_data.to_user_id);
        expect(saved_data).to.have.property('subject', create_data.subject);
        expect(saved_data).to.have.property('html', create_data.html);
        expect(saved_data).to.have.property('text', create_data.text);
        expect(saved_data).to.have.property('sent_at', null);
        expect(saved_data).to.have.property('email_status', EmailRepository.STATUS_TO_SEND);

        await email_repository.updateEmailSent(id);

        const email_sent = await email_repository.read(id);

        expect(email_sent).to.have.property('sent_at');
        expect(email_sent.sent_at).to.not.equal(null);

        const {
            sent_at,
        } = email_sent;

        expect(
            moment(sent_at).isBetween(moment().subtract(1, 'minute'), moment())
        ).to.equal(true);
        expect(email_sent).to.have.property('email_status', EmailRepository.STATUS_SENT);

    });
});


describe.only('calculateEmailRandomDelay', () => {

    const email_service = EmailService.getInstance();

    it('calculateEmailRandomDelay 1 10', () => {
        const range_min = 1;
        const range_max = 10;

        for (let i = 0; i < (range_max - range_min); i++) {
            expect(email_service.calculateEmailRandomDelay(range_min, range_max))
                .to.be.greaterThanOrEqual(range_min)
                .and.lessThanOrEqual(range_max);
        }
    });


    it('calculateEmailRandomDelay 2000 2100', () => {
        const range_min = 2000;
        const range_max = 2100;

        for (let i = 0; i < (range_max - range_min); i++) {
            expect(email_service.calculateEmailRandomDelay(range_min, range_max))
                .to.be.greaterThanOrEqual(range_min)
                .and.lessThanOrEqual(range_max);
        }
    });
});
