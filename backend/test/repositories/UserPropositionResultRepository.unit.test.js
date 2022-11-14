'use strict';

const {
    expect,
} = require('chai');
const {
    DataSeeder,
} = require('../test_helpers/DataSeeder');


const user_proposition_result_1 = {
    id: 1,
    campaign_id: 1,
    user_id: 1,
    proposition_id: 155,
    rank: 1,
};

const user_proposition_result_2 = {
    id: 2,
    campaign_id: 2,
    user_id: 3,
    proposition_id: 154,
    rank: 2,
};

const user_proposition_result_3 = {
    id: 3,
    campaign_id: 4,
    user_id: 6,
    proposition_id: 158,
    rank: 3,
};

const {
    UserPropositionResultRepository,
} = require('../../src/repositories/');

describe('UserPropositionResultRepository', () => {

    const user_proposition_result_repository = UserPropositionResultRepository.getInstance();

    before(async () => {
        await DataSeeder.truncate('UserPropositionResultRepository');
        await DataSeeder.create('UserPropositionResultRepository', user_proposition_result_1);
        await DataSeeder.create('UserPropositionResultRepository', user_proposition_result_2);
        await DataSeeder.create('UserPropositionResultRepository', user_proposition_result_3);
    });


    it('Should be able to search a UserPropositionEloResult by id', async () => {
        const result = await user_proposition_result_repository.search({
            id: user_proposition_result_2.id,
        });
        expect(result).to.be.an('Array');
        expect(result.length).to.equals(1);
        const [
            first,
        ] = result;
        expect(first).to.have.property('id', user_proposition_result_2.id);

    });


    it('Should be able to search a UserPropositionEloResult by id_list', async () => {
        const result = await user_proposition_result_repository.search({
            id_list: [
                user_proposition_result_3.id,
            ],
        });
        expect(result).to.be.an('Array');
        expect(result.length).to.equals(1);
        const [
            first,
        ] = result;
        expect(first).to.have.property('id', user_proposition_result_3.id);

    });


    it('Should be able to search a UserPropositionEloResult by proposition_id', async () => {
        const result = await user_proposition_result_repository.search({
            proposition_id: [
                user_proposition_result_3.proposition_id,
            ],
        });
        expect(result).to.be.an('Array');
        expect(result.length).to.equals(1);
        const [
            first,
        ] = result;
        expect(first).to.have.property('id', user_proposition_result_3.id);

    });

});
