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
        mocks.fs = mock(fs);
    });

    afterEach(() => {
        mocks.logger.restore();
        mocks.fs.restore();
    });

    it('Should log error when unable to load file', async () => {
        const file_path = 'RANDOM_FILE_PATH';
        const error_message = 'random error';
        const error = new Error(error_message);
        mocks.fs.expects('existsSync').withArgs(file_path).returns(true);
        mocks.fs.expects('readFileSync').withArgs(file_path, 'utf8').throws(error);
        mocks.logger.expects('log').withArgs(error);
        await configuration.tryToLoadConfigurationFile('RANDOM_FILE_PATH');
        mocks.fs.verify();
        mocks.logger.verify();
    });


    it('Should be able to find config from appen', () => {
        configuration.process_env_vars = {
            APPENV_PROPERTY_PATH: 'RANDOM_VALUE',
        };
        
        configuration.updateConfigurationWithEnvs('property_name_value', ['property', 'path']);
        expect(configuration.configuration.property.path).to.equal('RANDOM_VALUE');
    })
});
