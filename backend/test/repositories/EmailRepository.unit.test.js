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

    let created_data_list = [];

    beforeEach(async () => {

        await DataSeeder.truncate('EmailRepository');
        created_data_list = [];

        let created_data = null;
        created_data = await DataSeeder.create('EmailRepository', {
            ...create_data,
        });
        created_data_list.push(created_data);

        created_data = await DataSeeder.create('EmailRepository', {
            ...create_data,
            from_user_id: 102,
            to_user_id: 124,
        });
        created_data_list.push(created_data);

        created_data = await DataSeeder.create('EmailRepository', {
            ...create_data,
            from_user_id: 103,
        });
        created_data_list.push(created_data);

        created_data = await DataSeeder.create('EmailRepository', {
            ...create_data,
            email_status: EmailRepository.STATUS_SENT,
            sent_at: moment().subtract(12, 'hours'),
        });
        created_data_list.push(created_data);

        created_data = await DataSeeder.create('EmailRepository', {
            ...create_data,
            email_status: EmailRepository.STATUS_SENT,
            sent_at: moment().subtract(2, 'days'),
        });
        created_data_list.push(created_data);

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


    it('Should be able to search with sort', async () => {

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


    describe('Criteria tests', () => {
        it('Should be able to search by id_list', async () => {

            const email_list = await email_repository.search(
                {
                    id_list: [
                        created_data_list[1].id,
                        created_data_list[2].id,
                    ],
                }
            );
    
            const [
                row_1,
                row_2,
            ] = email_list;

            expect(row_1.id).to.be.equal(created_data_list[1].id);
            expect(row_2.id).to.be.equal(created_data_list[2].id);
        });

        it('Should be able to search by from_user_id_list', async () => {

            const email_list = await email_repository.search(
                {
                    from_user_id_list: [
                        created_data_list[1].from_user_id,
                        created_data_list[2].from_user_id,
                    ],
                }
            );
    
            const [
                row_1,
                row_2,
            ] = email_list;

            expect(row_1.id).to.be.equal(created_data_list[1].id);
            expect(row_2.id).to.be.equal(created_data_list[2].id);
        });

        it('Should be able to search by from_user_id', async () => {

            const email_list = await email_repository.search(
                {
                    from_user_id: created_data_list[2].from_user_id,
                }
            );
    
            const [
                row_1,
            ] = email_list;

            expect(row_1.id).to.be.equal(created_data_list[2].id);
        });

        it('Should be able to search by to_user_id', async () => {

            const email_list = await email_repository.search(
                {
                    to_user_id: created_data_list[1].to_user_id,
                }
            );
    
            const [
                row_1,
            ] = email_list;

            expect(row_1.id).to.be.equal(created_data_list[1].id);
        });

        it('Should be able to search by to_user_id_list', async () => {

            const email_list = await email_repository.search(
                {
                    to_user_id_list: [
                        created_data_list[1].to_user_id,
                    ],
                }
            );

            const [
                row_1,
            ] = email_list;

            expect(row_1.id).to.be.equal(created_data_list[1].id);
        });

        it('Should be able to search by sent_at_upper_boundary', async () => {

            const email_list = await email_repository.search(
                {
                    sent_at_upper_boundary: moment().subtract(24, 'hours'),
                }
            );

            const [
                row_1,
            ] = email_list;
            expect(row_1.id).to.be.equal(created_data_list[4].id);
        });

    });

    describe('countToSendEmails', () => {
        it('Should be able to countToSendEmails', async () => {
            const count = await email_repository.countToSendEmails();
            expect(count).to.be.equal(3);
        });
    });
});
