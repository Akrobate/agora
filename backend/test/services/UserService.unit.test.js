'use strict';

const {
    expect,
} = require('chai');

const {
    UserService,
} = require('../../src/services');


describe('UserService unit test', () => {

    const user_servce = UserService.getInstance();

    it('tryToSignJwt error', () => {
        try {
            user_servce.tryToSignJwt({}, '', '')
        } catch (error) {
            expect(error.message).to.equal('secretOrPrivateKey must have a value');
        }
    });
});
