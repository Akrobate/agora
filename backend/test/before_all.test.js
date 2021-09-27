'use strict';

const {
    configuration,
} = require('../src/configuration');

// const test_database_name = 'test-database';
// configuration.storage.mysql.database_name = test_database_name;

before((done) => {
    console.log('======================================');
    console.log('Database forced to be:', configuration.storage.mysql.database_name);
    console.log('======================================');

    // console.log('configuration', configuration)

    done();
});
