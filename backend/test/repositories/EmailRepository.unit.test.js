'use strict';

const {
    DataSeeder,
} = require('../test_helpers/DataSeeder');
const {
    expect,
} = require('chai');
const moment = require('moment');
const {
    EmailRepository,
} = require('../../src/repositories');

describe('EmailRepository unit tests', () => {

    const email_repository = EmailRepository.getInstance();

    beforeEach(async () => {
        const create_data = {
            email_to: 'to_toto@test.com',
            from_email: 'from_email@test.com',
            from_name: 'FromEmailLabel',
            from_user_id: 122,
            to_user_id: 123,
            subject: 'Email subject',
            html: '<p>Html content</p>',
            text: 'Text content',
            email_status: EmailRepository.STATUS_TO_SEND,
        };
        await DataSeeder.truncate('EmailRepository');
        await DataSeeder.create('EmailRepository', create_data);
        await DataSeeder.create('EmailRepository', create_data);
        await DataSeeder.create('EmailRepository', create_data);

        await DataSeeder.create('EmailRepository', {
            ...create_data,
            email_status: EmailRepository.STATUS_SENT,
            sent_at: moment().subtract(12, 'hours'),
        });

        await DataSeeder.create('EmailRepository', {
            ...create_data,
            email_status: EmailRepository.STATUS_SENT,
            sent_at: moment().subtract(2, 'days'),
        });

    });

    it('Should be able to count', async () => {
        const email_count = await email_repository.count();
        expect(email_count).to.equal(5);
    });


    it('Should be able to count by status', async () => {
        let email_count = 0;
        email_count = await email_repository.count({
            email_status: EmailRepository.STATUS_TO_SEND,
        });
        expect(email_count).to.equal(3);

        email_count = await email_repository.count({
            email_status: EmailRepository.STATUS_SENT,
        });
        expect(email_count).to.equal(2);
    });

    it('Should be able to count by status list', async () => {
        let email_count = 0;
        email_count = await email_repository.count({
            email_status_list: [
                EmailRepository.STATUS_TO_SEND,
            ],
        });
        expect(email_count).to.equal(3);

        email_count = await email_repository.count({
            email_status_list: [
                EmailRepository.STATUS_TO_SEND,
                EmailRepository.STATUS_SENT,
            ],
        });
        expect(email_count).to.equal(5);
    });


    it('Should be able to count by status list and sent_at_lower_boundary', async () => {
        let email_count = 0;
        email_count = await email_repository.count({
            email_status_list: [
                EmailRepository.STATUS_SENT,
            ],
            sent_at_lower_boundary: moment().subtract(24, 'hours'),
        });
        expect(email_count).to.equal(1);

        email_count = await email_repository.count({
            email_status_list: [
                EmailRepository.STATUS_SENT,
            ],
            sent_at_lower_boundary: moment().subtract(7, 'days'),
        });
        expect(email_count).to.equal(2);
    });


    it('Should be able to search', async () => {

        const email_list = await email_repository.search(
            {
                email_status: EmailRepository.STATUS_TO_SEND,
            },
            {
                sort_list: [
                    '-id',
                ],
            }
        );

        const [
            row_1,
            row_2,
        ] = email_list;

        expect(row_1.id > row_2.id).to.be.equal(true);
    });



});
