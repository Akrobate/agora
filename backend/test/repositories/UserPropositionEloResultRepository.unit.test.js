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


const user_proposition_elo_result_1 = {
    id: 1,
    campaign_id: 1,
    user_id: 1,
    proposition_id: 155,
    elo_score: 100,
    display_count: 10,
};

const user_proposition_elo_result_2 = {
    id: 2,
    campaign_id: 2,
    user_id: 3,
    proposition_id: 154,
    elo_score: 100,
    display_count: 10,
};

const user_proposition_elo_result_3 = {
    id: 3,
    campaign_id: 4,
    user_id: 6,
    proposition_id: 158,
    elo_score: 100,
    display_count: 10,
};

const {
    UserPropositionEloResultRepository,
} = require('../../src/repositories/');

describe('UserPropositionEloResultRepository', () => {

    const user_proposition_elo_result_repository = UserPropositionEloResultRepository.getInstance();

    before(async () => {
        await DataSeeder.truncate('UserPropositionEloResultRepository');
        await DataSeeder.create('UserPropositionEloResultRepository', user_proposition_elo_result_1);
        await DataSeeder.create('UserPropositionEloResultRepository', user_proposition_elo_result_2);
        await DataSeeder.create('UserPropositionEloResultRepository', user_proposition_elo_result_3);
    });


    it('Should be able to search a UserPropositionEloResult by id', async () => {
        const result = await user_proposition_elo_result_repository.search({
            id: user_proposition_elo_result_2.id,
        });
        expect(result).to.be.an('Array');
        expect(result.length).to.equals(1);
        const [
            first,
        ] = result;
        expect(first).to.have.property('id', user_proposition_elo_result_2.id);

    });


    it('Should be able to search a UserPropositionEloResult by id_list', async () => {
        const result = await user_proposition_elo_result_repository.search({
            id_list: [
                user_proposition_elo_result_1.id,
            ]
        });
        expect(result).to.be.an('Array');
        expect(result.length).to.equals(1);
        const [
            first,
        ] = result;
        expect(first).to.have.property('id', user_proposition_elo_result_1.id);

    });


    it('Should be able to search a UserPropositionEloResult by proposition_id', async () => {
        const result = await user_proposition_elo_result_repository.search({
            proposition_id: [
                user_proposition_elo_result_3.proposition_id,
            ]
        });
        expect(result).to.be.an('Array');
        expect(result.length).to.equals(1);
        const [
            first,
        ] = result;
        expect(first).to.have.property('id', user_proposition_elo_result_3.id);

    });

});
