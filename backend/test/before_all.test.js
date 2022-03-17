'use strict';

const {
    stub,
} = require('sinon');
const {
    configuration,
} = require('../src/configuration');

const stubs = {};

const MUTE_CONSOLE_LOGS = false;

before((done) => {
    if (MUTE_CONSOLE_LOGS) {
        stubs.console_log = stub(console, 'log').callsFake(() => null);
    }

    console.log('======================================');
    console.log('Database forced to be:', configuration.storage.mysql.database_name);
    console.log('======================================');
    done();
});
