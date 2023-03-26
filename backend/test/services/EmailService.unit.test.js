'use strict';

const {
    DataSeeder,
} = require('../test_helpers/DataSeeder');
const {
    expect,
} = require('chai');
const {
    mock,
} = require('sinon');
const {
    EmailService,
} = require('../../src/services');
const {
    EmailRepository,
} = require('../../src/repositories');
const moment = require('moment');

const mocks = {};

describe('EmailService unit tests', () => {

    const email_repository = EmailRepository.getInstance();
    const email_service = EmailService.getInstance();

    const create_data_seed = {
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


    beforeEach(async () => {
        await DataSeeder.truncate('EmailRepository');
        mocks.email_repository = mock(email_repository);
        mocks.email_service = mock(email_service);
    });

    afterEach(() => {
        mocks.email_service.restore();
        mocks.email_repository.restore();
    });

    it('Should be able to enqueue email', async () => {
        const create_data = create_data_seed;
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
        const create_data = create_data_seed;
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


    it('Should be able to process enqueued mail and do nothing if nothing to send', async () => {
        mocks.email_service.expects('sendOldestWaitingMail').never();
        mocks.email_service.expects('waitRandomEmailDelay').never();
        await email_service.startEmailSender();
        mocks.email_service.verify();
    });


    it.only('Should be able to process ONE enqueued mail and do one execution of send', async () => {
        const email_data = await email_service.createQueuedSendMail(create_data_seed);

        mocks.email_service.expects('waitRandomEmailDelay')
            .once()
            .resolves();

        expect(email_service.email_sender_running).to.equal(false);
        await email_service.startEmailSender();
        expect(email_service.email_sender_running).to.equal(false);
        

        mocks.email_service.verify();
    });


});


describe('calculateEmailRandomDelay', () => {

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

    it('calculateEmailRandomDelay 5000 10000', () => {
        const range_min = 5000;
        const range_max = 10000;

        for (let i = 0; i < (range_max - range_min); i++) {
            expect(email_service.calculateEmailRandomDelay(range_min, range_max))
                .to.be.greaterThanOrEqual(range_min)
                .and.lessThanOrEqual(range_max);
        }
    });
});
