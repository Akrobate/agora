'use strict';

const superTest = require('supertest');
const HTTP_CODE = require('http-status');
const {
    expect,
} = require('chai');
const {
    mock,
} = require('sinon');

const {
    AuthenticationMiddleware,
} = require('../../src/middlewares');

describe('AuthenticationMiddleware', () => {

    const mocks = {};

    beforeEach(() => {

    });

    afterEach(() => {

    });


    it.skip('checkJwtValidity should faile when cannot validate', async () => {

    });
});
