'use strict';

const {
    expect,
} = require('chai');
const {
    v4,
} = require('uuid');
const {
    DataSeeder,
} = require('../test_helpers/DataSeeder');
const {
    UserRepository,
} = require('../../src/repositories/UserRepository');

describe('UserRepository', () => {

    const user_repository = UserRepository.getInstance();

    before(async () => {
        await DataSeeder.truncate('UserRepository');
    });


    it('Should be able to create a user', async () => {
        const user_seed = {
            first_name: 'Artiom',
            last_name: 'Fedorov',
            password: 'password_hashed',
            email: `artiom.fedorov@${v4()}.com`,
        };

        const result = await user_repository.create(user_seed);
        expect(result).to.be.an('Object');
    });

});
