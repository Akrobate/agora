/* eslint-disable */

'use strict';

const yaml = require('js-yaml');
const deepmerge = require('deepmerge');
const fs = require('fs');
const lodash = require('lodash');

const {
    logger,
} = require('../logger');


const CONFIGURATION_SAMPLE_YAML_FILE = './configuration.default.yml';
const CONFIGURATION_YAML_FILE = './configuration.yml';

let configuration = {};
let configuration_file = {};
const process_env_vars = process.env;

try {
    if (fs.existsSync(CONFIGURATION_SAMPLE_YAML_FILE)) {
        configuration = yaml
            .load(
                fs.readFileSync(
                    CONFIGURATION_SAMPLE_YAML_FILE,
                    'utf8'
                )
            );
    }
} catch (error) {
    logger.log(error);
}

try {
    if (fs.existsSync(CONFIGURATION_YAML_FILE)) {
        configuration_file = yaml
            .load(
                fs.readFileSync(
                    CONFIGURATION_YAML_FILE,
                    'utf8'
                )
            );    
        configuration = deepmerge(configuration, configuration_file);
    }
} catch (error) {
    logger.log(error);
}


function updateConfigurationWithEnvs(branch_to_parse, path = []) {
    if (typeof branch_to_parse === 'object') {
        for (const property in branch_to_parse) {
            if (branch_to_parse.hasOwnProperty(property)) {
                updateConfigurationWithEnvs(branch_to_parse[property], [].concat(path, [property]));
            }
        }
    } else {
        const env_var_name = ['appenv'].concat(path)
            .join('_')
            .toUpperCase();
        if (process_env_vars[env_var_name] !== undefined) {
            lodash.set(configuration, path, process_env_vars[env_var_name]);
        }
    }
}

updateConfigurationWithEnvs(configuration);

module.exports = {
    configuration,
};
