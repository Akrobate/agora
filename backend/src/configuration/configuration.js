/* eslint-disable */

'use strict';

const yaml = require('js-yaml');
const deepmerge = require('deepmerge');
const fs = require('fs');
const lodash = require('lodash');

const {
    logger,
} = require('../logger');


class Configuration {

    /**
     * Constructor
     */
    constructor() {
        this.CONFIGURATION_SAMPLE_YAML_FILE = './configuration.default.yml';
        this.CONFIGURATION_YAML_FILE = './configuration.yml';

        this.process_env_vars = process.env;

        this.overrideDefaultConfigurationFileIfSettedInEnvVars();

        this.configuration = {};
    }


    /**
     * @returns {void}
     */
    overrideDefaultConfigurationFileIfSettedInEnvVars() {
        if (this.process_env_vars.CONFIGURATION_YAML_FILE) {
            this.CONFIGURATION_YAML_FILE = this.process_env_vars.CONFIGURATION_YAML_FILE;
        }
    }


    /**
     * @returns {Object}
     */
    load() {
        this.configuration = this.tryToLoadConfigurationFile(this.CONFIGURATION_SAMPLE_YAML_FILE);
        this.configuration = deepmerge(
            this.configuration,
            this.tryToLoadConfigurationFile(this.CONFIGURATION_YAML_FILE)
        );
        this.updateConfigurationWithEnvs(this.configuration);
        return this.configuration;
    }


    /**
     * @returns {Void}
     */
    tryToLoadConfigurationFile(file_name) {
        let configuration = {};
        try {
            if (fs.existsSync(file_name)) {
                configuration = yaml
                    .load(
                        fs.readFileSync(
                            file_name,
                            'utf8'
                        )
                    );
            }
        } catch (error) {
            logger.log(error);
        }
        return configuration;
    }


    /**
     * @param {*} branch_to_parse 
     * @param {*} path 
     * @returns {Void}
     */
    updateConfigurationWithEnvs(branch_to_parse, path = []) {
        if (typeof branch_to_parse === 'object') {
            for (const property in branch_to_parse) {
                this.updateConfigurationWithEnvs(branch_to_parse[property], [].concat(path, [property]));
            }
        } else {
            const env_var_name = ['appenv'].concat(path)
                .join('_')
                .toUpperCase();
            if (this.process_env_vars[env_var_name] !== undefined) {
                lodash.set(this.configuration, path, this.process_env_vars[env_var_name]);
            }
        }
    }
}


const configuration_instance = new Configuration();
const configuration = configuration_instance.load();


module.exports = {
    configuration,
    Configuration,
};
