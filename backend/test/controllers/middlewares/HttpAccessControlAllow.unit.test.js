'use strict';

const {
    access_control_allow_middleware,
} = require('../../../src/middlewares');

describe('HttpAccessControlAllow unit test', () => {

    it('access_control_allow_middleware if header is not setted', (done) => {
        const request = {};
        const response = {};
        const next = () => {
            done();
        };
        access_control_allow_middleware(request, response, next);
    });


    it('access_control_allow_middleware if header is setted', (done) => {
        const request = {
            headers: {},
        };
        const response = {
            header: () => null,
        };
        const next = () => {
            done();
        };
        access_control_allow_middleware(request, response, next);
    });

});
