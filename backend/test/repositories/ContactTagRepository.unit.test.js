'use strict';

const {
    DataSeeder,
} = require('../test_helpers/DataSeeder');
const {
    expect,
} = require('chai');
// const moment = require('moment');
const {
    ContactTagRepository,
} = require('../../src/repositories');


// @TODO Need to create seed data
describe.skip('ContactTagRepository unit tests', () => {

    const contact_tag_repository = ContactTagRepository.getInstance();
    const create_data = {};

    let created_data_list = [];

    beforeEach(async () => {

        await DataSeeder.truncate('ContactTagRepository');
        created_data_list = [];

        let created_data = null;
        created_data = await DataSeeder.create('ContactTagRepository', {
            ...create_data,
        });
        created_data_list.push(created_data);

        created_data = await DataSeeder.create('ContactTagRepository', {
            ...create_data,
        });
        created_data_list.push(created_data);

        created_data = await DataSeeder.create('ContactTagRepository', {
            ...create_data,
        });
        created_data_list.push(created_data);

    });


    it('Should be able to search by id_list', async () => {

        const contact_tag_list = await contact_tag_repository.search(
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
        ] = contact_tag_list;

        expect(row_1.id).to.be.equal(created_data_list[1].id);
        expect(row_2.id).to.be.equal(created_data_list[2].id);
    });

    it('Should be able to search by from_user_id_list', async () => {

        const contact_tag_list = await contact_tag_repository.search(
            {
                from_user_id_list: [
                    created_data_list[1].from_user_id,
                    created_data_list[2].from_user_id,
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
});
