'use strict';

const {
    expect,
} = require('chai');

const {
    BordaAlgorithm,
} = require('../../../src/services/voting_algorithms');

describe('BordaAlgorithm', () => {

    const borda_algorithm = BordaAlgorithm.getInstance();

    it('Should be able to classify by BordaAlgorithm propositions', () => {
        const votes_results = [
            ['A', 'B', 'C'],
            ['A', 'B', 'C'],
            ['B', 'C', 'A'],
            ['C', 'B', 'A'],
        ];

        const possibilities = [
            'A', 'B', 'C',
        ];

        const result = borda_algorithm
            .process(possibilities, votes_results);
        expect(result).to.deep.equal(['B', 'A', 'C']);
    });

    it('Should be able to getScoreForEachItem', () => {
        expect(
            borda_algorithm.getScoreForEachItem(['A', 'B', 'C'])
        ).to.deep.equal(
            {
                'A': 3,
                'B': 2,
                'C': 1,
            }
        );
    });


    it('Should be able to initAllItemScore', () => {
        expect(
            borda_algorithm.initAllItemScore(['A', 'B'])
        ).to.deep.equal(
            {
                'A': 0,
                'B': 0,
            }
        );
    });

});
