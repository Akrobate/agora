'use strict';

const Promise = require('bluebird');

const {
    sequelize,
} = require('../src/repositories/connections/Sequelize');

after(async () => {
    await Promise.delay(500);
    await sequelize.close();
    console.log('............... After all Teardown, closing mongoDb connection ..............');
});
