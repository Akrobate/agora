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
        mocks.fs.expects('existsSync')
            .withArgs(file_path)
            .returns(true);
        mocks.fs.expects('readFileSync')
            .withArgs(file_path, 'utf8')
            .throws(error);
        mocks.logger.expects('log').withArgs(error);
        await configuration.tryToLoadConfigurationFile(file_path);
        mocks.fs.verify();
        mocks.logger.verify();
    });

    it('Should not modify configuration if no file found', async () => {
        const file_path = 'RANDOM_FILE_PATH';
        mocks.fs.expects('existsSync')
            .withArgs(file_path)
            .returns(false);
        const config = await configuration.tryToLoadConfigurationFile(file_path);
        mocks.fs.verify();
        expect(config).to.deep.equal({});
    });

    it('Should be able to find config from appen', () => {
        configuration.process_env_vars = {
            APPENV_PROPERTY_PATH: 'RANDOM_VALUE',
        };

        configuration.updateConfigurationWithEnvs('property_name_value', ['property', 'path']);
        expect(configuration.configuration.property.path).to.equal('RANDOM_VALUE');
    });


    it('overrideDefaultConfigurationFileIfSettedInEnvVars unit test', () => {
        const _configuration = new Configuration();
        delete _configuration.process_env_vars.CONFIGURATION_YAML_FILE;

        _configuration.overrideDefaultConfigurationFileIfSettedInEnvVars();
        expect(_configuration.CONFIGURATION_YAML_FILE).to.equal('./configuration.test.yml');

        _configuration.process_env_vars.CONFIGURATION_YAML_FILE = 'overide_file';
        _configuration.overrideDefaultConfigurationFileIfSettedInEnvVars();
        expect(_configuration.CONFIGURATION_YAML_FILE).to.equal('overide_file');
    });
});
