'use strict';

const jwt = require('jsonwebtoken');

const {
    expect,
} = require('chai');
const {
    mock,
} = require('sinon');

const {
    AuthenticationMiddleware,
} = require('../../src/middlewares/AuthenticationMiddleware');

const authentication_middleware = AuthenticationMiddleware.getInstance();

describe('AuthenticationMiddleware', () => {

    const mocks = {};

    beforeEach(() => {
        mocks.jwt = mock(jwt);
    });

    afterEach(() => {
        mocks.jwt.restore();
    });


    it('checkJwtValidity should faile when cannot validate', (done) => {
        mocks.jwt.expects('verify')
            .throws(new Error('Some error'));
        try {
            authentication_middleware.checkJwtValidity('JWT_STRING');
        } catch (error) {
            expect(error.message).to.equals('Some error');
            mocks.jwt.verify();
            done();
        }

    });
});
