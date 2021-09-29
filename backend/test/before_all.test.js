'use strict';

const {
    configuration,
} = require('../src/configuration');

before((done) => {
    console.log('======================================');
    console.log('Database forced to be:', configuration.storage.mysql.database_name);
    console.log('======================================');
    done();
});
