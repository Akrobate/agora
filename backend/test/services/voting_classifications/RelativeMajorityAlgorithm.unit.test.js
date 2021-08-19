'use strict';

const {
    expect,
} = require('chai');

const {
    RelativeMajorityAlgorithm,
} = require('../../../src/services/voting_algorithms/RelativeMajorityAlgorithm');

describe('RelativeMajorityAlgorithm', () => {

    const votes_results = [
        ['A', 'B', 'C'],
        ['A', 'B', 'C'],
        ['A', 'C', 'B'],
        ['C', 'B', 'A'],
        ['C'],
        [],
    ];

    const possibilities = [
        'A', 'B', 'C',
    ];

    const relative_majority_algorithm = RelativeMajorityAlgorithm.getInstance();

    it('Should be able to classify by relative Majority propositions', () => {
        const result = relative_majority_algorithm
            .process(possibilities, votes_results);
        expect(result).to.deep.equal(['A', 'C', 'B']);
    });


    it('Should be able to count occurences', () => {
        const occurence_list = relative_majority_algorithm.countArrayOccurences(
            ['B', 'A', 'A', 'B', 'A', 'C']
        );
        expect(occurence_list).to.deep.equal(
            [
                {
                    item: 'B',
                    count: 2,
                },
                {
                    item: 'A',
                    count: 3,
                },
                {
                    item: 'C',
                    count: 1,
                },
            ]
        );
    });


    it('Should be able to count and sort occurences', () => {
        const occurence_list = relative_majority_algorithm.countSortDescArrayOccurences(
            ['B', 'A', 'A', 'B', 'A', 'C']
        );
        expect(occurence_list).to.deep.equal(
            [
                {
                    item: 'A',
                    count: 3,
                },
                {
                    item: 'B',
                    count: 2,
                },
                {
                    item: 'C',
                    count: 1,
                },
            ]
        );
    });


    it('Should be able to count and sort occurences', () => {
        const vote_list = [
            ['A', 'B', 'C'],
            ['A', 'B', 'C'],
            ['B', 'C', 'A'],
            ['C', 'B', 'A'],
        ];

        relative_majority_algorithm
            .inPlaceSetToNullElementListInAllVoteList(
                vote_list,
                [
                    'A', 'B',
                ]
            );

        expect(vote_list).to.deep.equal([
            [null, null, 'C'],
            [null, null, 'C'],
            [null, 'C', null],
            ['C', null, null],
        ]);
    });
});
