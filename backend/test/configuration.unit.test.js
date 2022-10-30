'use strict';

const {
    expect,
} = require('chai');

const {
    mock,
} = require('sinon');

const fs = require('fs');

const {
    logger,
} = require('../src/logger');

const {
    Configuration,
} = require('../src/configuration/configuration');


const configuration = new Configuration();

describe('Configuration unit test', () => {
    const mocks = {};

    beforeEach(() => {
        mocks.logger = mock(logger);
    });

    afterEach(() => {
        mocks.logger.restore();
    });

    it('Should log error when unable to load file', async () =>{
        await configuration.tryToLoadConfigurationFile('UNEXISTING_FILE_PATH');
        
    });
});
