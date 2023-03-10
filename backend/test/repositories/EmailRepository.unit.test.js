'use strict';

const {
    DataSeeder,
} = require('../test_helpers/DataSeeder');
const {
    expect,
} = require('chai');

const {
    EmailRepository,
} = require('../../src/repositories');

describe.only('EmailRepository unit tests', () => {

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
        });

        await DataSeeder.create('EmailRepository', {
            ...create_data,
            email_status: EmailRepository.STATUS_SENT,
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
});
