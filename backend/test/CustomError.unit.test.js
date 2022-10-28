'use strict';

const {
    expect,
} = require('chai');

const {
    CustomError,
} = require('../src/CustomError');


describe('CustomError unit tests', () => {

    it('Should be able to create Error with object message', () => {
        const message_seed = {
            property: 'value',
        };
        const random_code = 123;
        const custom_error = new CustomError(random_code, message_seed)
        expect(custom_error.message_object).to.deep.equal({
            message: message_seed
        });
    });

    it('Should be able to create Error without message', () => {
        const message_seed = {
            property: 'value',
        };
        const random_code = 123;
        const custom_error = new CustomError(random_code)
        expect(custom_error.message_object).to.equal(null);
    });

    it('Should be able to get code', () => {
        const random_code = 123;
        const custom_error = new CustomError(random_code, 'random message')

        expect(custom_error.getCode()).to.equal(random_code);
    
    });

});
