'use strict';

const {
    DataSeeder,
} = require('../test_helpers/DataSeeder');
const {
    expect,
} = require('chai');
// const moment = require('moment');
const {
    UserContactTagRepository,
} = require('../../src/repositories');


describe('UserContactTagRepository unit tests', () => {

    const user_contact_tag_repository = UserContactTagRepository.getInstance();
    const create_data = {
        user_id: 100,
        contact_user_id: 201,
        tag_id: 20,
    };

    let created_data_list = [];

    beforeEach(async () => {

        await DataSeeder.truncate('UserContactTagRepository');
        created_data_list = [];

        let created_data = null;
        created_data = await DataSeeder.create('UserContactTagRepository', {
            ...create_data,
        });
        created_data_list.push(created_data);

        created_data = await DataSeeder.create('UserContactTagRepository', {
            ...create_data,
            user_id: 101,
            contact_user_id: 202,
        });
        created_data_list.push(created_data);

        created_data = await DataSeeder.create('UserContactTagRepository', {
            ...create_data,
            user_id: 102,
        });
        created_data_list.push(created_data);

    });


    it('Should be able to search by id', async () => {

        const user_contact_tag_list = await user_contact_tag_repository.search(
            {
                id: created_data_list[2].id,
            }
        );

        const [
            row_1,
        ] = user_contact_tag_list;

        expect(row_1.id).to.be.equal(created_data_list[2].id);
    });

    it('Should be able to search by id_list', async () => {

        const user_contact_tag_list = await user_contact_tag_repository.search(
            {
                id_list: [
                    created_data_list[1].id,
                    created_data_list[2].id,
                ],
            }
        );

        const [
            row_1,
            row_2,
        ] = user_contact_tag_list;

        expect(row_1.id).to.be.equal(created_data_list[1].id);
        expect(row_2.id).to.be.equal(created_data_list[2].id);
    });


    it('Should be able to search by user_id_list', async () => {

        const contact_tag_list = await user_contact_tag_repository.search(
            {
                user_id_list: [
                    created_data_list[1].user_id,
                    created_data_list[2].user_id,
                ],
            }
        );

        const [
            row_1,
            row_2,
        ] = contact_tag_list;

        expect(row_1.id).to.be.equal(created_data_list[1].id);
        expect(row_2.id).to.be.equal(created_data_list[2].id);
    });

    it('Should be able to search by contact_user_id', async () => {

        const contact_tag_list = await user_contact_tag_repository.search(
            {
                contact_user_id: created_data_list[1].contact_user_id,
            }
        );

        const [
            row_1,
        ] = contact_tag_list;

        expect(row_1.id).to.be.equal(created_data_list[1].id);
    });
});
