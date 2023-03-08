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
const moment = require('moment');

describe.only('EmailRepository unit tests', () => {

    const email_repository = EmailRepository.getInstance();

    beforeEach(async () => {
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
        await DataSeeder.truncate('EmailRepository');
    });

    it('Should be able to count', async () => {
    
    });


    it('Should be able to count by status', async () => {

    });
});
