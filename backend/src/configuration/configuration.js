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

        if (process.env.CONFIGURATION_YAML_FILE) {
            this.CONFIGURATION_YAML_FILE = process.env.CONFIGURATION_YAML_FILE;
        }

        this.configuration = {};
        this.configuration_file = {};
        this.process_env_vars = process.env;
    }


    /**
     * @returns {Object}
     */
    load() {
        this.tryToLoadSampleConfigurationFile();
        this.tryToLoadConfigurationFile();
        this.updateConfigurationWithEnvs(this.configuration);
        return this.configuration;
    }


    /**
     * @returns {Void}
     */
    tryToLoadSampleConfigurationFile() {
        try {
            if (fs.existsSync(this.CONFIGURATION_SAMPLE_YAML_FILE)) {
                this.configuration = yaml
                    .load(
                        fs.readFileSync(
                            this.CONFIGURATION_SAMPLE_YAML_FILE,
                            'utf8'
                        )
                    );
            }
        } catch (error) {
            logger.log(error);
        }
    }


    /**
     * @returns {Void}
     */
    tryToLoadConfigurationFile() {
        try {
            if (fs.existsSync(this.CONFIGURATION_YAML_FILE)) {
                this.configuration_file = yaml
                    .load(
                        fs.readFileSync(
                            this.CONFIGURATION_YAML_FILE,
                            'utf8'
                        )
                    );    
                this.configuration = deepmerge(this.configuration, this.configuration_file);
            }
        } catch (error) {
            logger.log(error);
        }
    }


    /**
     * @param {*} branch_to_parse 
     * @param {*} path 
     * @returns {Void}
     */
    updateConfigurationWithEnvs(branch_to_parse, path = []) {
        if (typeof branch_to_parse === 'object') {
            for (const property in branch_to_parse) {
                if (branch_to_parse.hasOwnProperty(property)) {
                    this.updateConfigurationWithEnvs(branch_to_parse[property], [].concat(path, [property]));
                }
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
