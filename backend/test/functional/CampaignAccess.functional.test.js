'use strict';

const superTest = require('supertest');
const HTTP_CODE = require('http-status');

const {
    expect,
} = require('chai');

const crypto = require('crypto');

const {
    configuration,
} = require('../../src/configuration');

const {
    app,
} = require('../../src/app');

const {
    CampaignRepository,
    UserRepository,
} = require('../../src/repositories');

const superApp = superTest(app);

describe.only('CampaignAccess', () => {

    const campaign_repository = CampaignRepository.getInstance();
    const user_repository = UserRepository.getInstance();

    const user_seed = {
        password: 'ShouldHaveLettersDigitsAndAtLeast8chars',
        email: 'artiom.fedorov@test.com',
    };

    const campagin_seed = {
        title: 'Title of campaign',
        description: 'Something',
    };

    before(async () => {

        await campaign_repository.sequelize_model.destroy({
            truncate: true,
            cascade: false,
        });

        await user_repository.sequelize_model.destroy({
            truncate: true,
            cascade: false,
        });

        const hashed_password = crypto
            .createHash('sha256')
            .update(`${configuration.security.salt}${user_seed.password}`)
            .digest('base64');

        await user_repository.create(Object.assign({}, user_seed, {
            password: hashed_password,
        }));

        // await campaign_repository.create(campagin_seed);

    });


    it('Should be able to create a campaign', async () => {

        let jwt_token = null;

        await superApp
            .post('/api/v1/users/login')
            .send(user_seed)
            .expect(HTTP_CODE.OK)
            .expect((response) => {
                jwt_token = response.body.token;
            });

        console.log(jwt_token);

        await superApp
            .post('/api/v1/campaigns')
            .set('Authorization', `Bearer ${jwt_token}`)
            .send(campagin_seed)
            .expect(HTTP_CODE.CREATED)
            .expect((response) => {
                console.log(response.body);
            });
    });

});
