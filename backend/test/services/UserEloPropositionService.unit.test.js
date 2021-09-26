'use strict';

const {
    expect,
} = require('chai');

const {
    UserEloPropositionService,
} = require('../../src/services');


describe('UserEloPropositionService unit tests', () => {

    const data_empty = [];

    const data = [
        {
            id: 1,
            display_count: 100,
        },
        {
            id: 2,
            display_count: 10,
        },
        {
            id: 3,
            display_count: 10,
        },
        {
            id: 4,
            display_count: 0,
        },
        {
            id: 5,
            display_count: 0,
        },
    ];

    const user_elo_proposition_service = UserEloPropositionService.getInstance();

    it('groupArrayByDisplayCount', () => {
        const result = user_elo_proposition_service.groupArrayByDisplayCount(data);
        console.log(result);
    });

    it('groupArrayByDisplayCount empty array', () => {
        const result = user_elo_proposition_service.groupArrayByDisplayCount(data_empty);
        expect(result).to.deep.equal([]);
    });

    it('buildDistributedList', () => {
        const grouped_list = user_elo_proposition_service.groupArrayByDisplayCount(data);
        const probability_list = user_elo_proposition_service.buildDistributedList(grouped_list);
        console.log(probability_list);
    });

    it('buildDistributedList and buildDistributedList - Large data', () => {
        const big_data = [];
        const size = 1000;
        for (let index = 0; index < size; index++) {
            big_data.push({
                id: Math.ceil(Math.random() * 10000),
                display_count: Math.ceil(Math.random() * 100),
            });
        }

        const grouped_list = user_elo_proposition_service.groupArrayByDisplayCount(big_data);
        const probability_list = user_elo_proposition_service.buildDistributedList(grouped_list);
        expect(probability_list).to.be.an('Array');
        expect(probability_list.length).to.be.gt(0);
    })
        .timeout(20000);


    it('performRandomChoiceFromList', () => {

        const choices_list = [1, 2, 3, 4];

        const iterations = 100;
        const all_results = [];
        for (let index = 0; index < iterations; index++) {
            all_results.push(
                user_elo_proposition_service.performRandomChoiceFromList(choices_list)
            );
        }

        choices_list.forEach((choice) => {
            expect(all_results).to.be.an('Array').that.includes(choice);
        });

    });

});
