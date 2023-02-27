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


describe.only('EmailService unit tests', () => {

    beforeEach(async () => {
        await DataSeeder.truncate('EmailRepository');
    });

    it('Should be able to enqueue email', async () => {
        const email_service = EmailService.getInstance();
        const create_data = {
            to_list: [
                'to_toto@test.com',
                'to_toto@test2.com'
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
        console.log(email_data);
        expect(email_data).to.have.property('id');

    });

});
