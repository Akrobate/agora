'use strict';

const {
    expect,
} = require('chai');

const {
    EloCalculator,
} = require('../../../src/services/commons');

/**
 *
 * Suppose there is a live match on chess.com between two players
 * rating1 = 1200, rating2 = 1000;
 * P1 = (1.0 / (1.0 + pow(10, ((1000-1200) / 400)))) = 0.76
 * P2 = (1.0 / (1.0 + pow(10, ((1200-1000) / 400)))) = 0.24
 *
 * And Assume constant K=30;
 *
 * CASE-1 : Suppose Player 1 wins:
 * rating1 = rating1 + k*(actual – expected) = 1200+30(1 – 0.76) = 1207.2;
 * rating2 = rating2 + k*(actual – expected) = 1000+30(0 – 0.24) = 992.8;
 *
 * Case-2 : Suppose Player 2 wins:
 * rating1 = rating1 + k*(actual – expected) = 1200+30(0 – 0.76) = 1177.2;
 * rating2 = rating2 + k*(actual – expected) = 1000+30(1 – 0.24) = 1022.8;
 *
 * https://www.geeksforgeeks.org/elo-rating-algorithm/
 *
 */

describe('EloCalculator', () => {

    const elo_calculator = EloCalculator.getInstance();


    it('calculateWinProbability', () => {
        const result = elo_calculator.calculateWinProbability(1000, 1200);
        expect(result).to.be.a('Number');
        expect(result.toFixed(2)).to.equal('0.76');
    });


    it('getScorePlayerWins', () => {
        const player_elo = 1200;
        const opponent_elo = 1000;
        const player_k = 30;

        const result = elo_calculator.getScorePlayerWins(player_elo, opponent_elo, player_k);
        expect(result).to.be.a('Number');
        const int_result = parseInt(result, 10);
        expect(int_result).to.equal(1207);
    });


    it('getScorePlayerLose', () => {
        const player_elo = 1000;
        const opponent_elo = 1200;
        const player_k = 30;

        const result = elo_calculator.getScorePlayerLose(player_elo, opponent_elo, player_k);
        expect(result).to.be.a('Number');
        const int_result = parseInt(result, 10);
        expect(int_result).to.equal(992);
    });


    it('getScorePlayerEgality', () => {
        const player_elo = 1000;
        const opponent_elo = 1200;
        const player_k = 30;

        const result = elo_calculator.getScorePlayerEgality(player_elo, opponent_elo, player_k);
        expect(result).to.be.a('Number');
        const int_result = parseInt(result, 10);
        expect(int_result).to.equal(1007);
    });

});
