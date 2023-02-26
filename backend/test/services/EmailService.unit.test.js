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


describe('EmailService unit tests', () => {

    beforeEach(async () => {
        await DataSeeder.truncate('EmailRepository');
    });

    it('Should be able to enqueue email', () => {

    });

});
