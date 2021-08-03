'use strict';

const {
    v4,
} = require('uuid');

const {
    UserRepository,
} = require('../../src/repositories/UserRepository');

describe('UserRepository', () => {

    const user_repository = UserRepository.getInstance();

    before(async () => {
        await user_repository.sequelize_model.destroy({
            truncate: true,
            cascade: false,
        });
    });

    it('Should be able to create a user', async () => {
        // const user_repository = UserRepository.getInstance();
        const user_seed = {
            first_name: 'Artiom',
            last_name: 'Fedorov',
            password: 'password_hashed',
            email: `artiom.fedorov@${v4()}.com`,
        };

        const result = await user_repository.create(user_seed);
        console.log(result);
    });

});
