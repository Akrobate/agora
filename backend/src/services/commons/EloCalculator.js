'use strict';


class EloCalculator {

    /* istanbul ignore next */
    /**
     * @static
     * @returns {EloCalculator}
     */
    static getInstance() {
        if (EloCalculator.instance === null) {
            EloCalculator.instance = new EloCalculator();
        }
        return EloCalculator.instance;
    }


    /**
     * @param {Number} player_elo
     * @param {Number} opponent_elo
     * @param {Number} player_k
     * @returns {Void}
     * @throws {CustomError}
     */
    getScorePlayerWins(player_elo, opponent_elo, player_k = 40) {
        const prob = this.calculateWinProbability(opponent_elo, player_elo);
        const new_elo = player_elo + (player_k * (1 - prob));
        return new_elo;
    }


    /**
     * @param {Number} player_elo
     * @param {Number} opponent_elo
     * @param {Number} player_k
     * @returns {Void}
     * @throws {CustomError}
     */
    getScorePlayerLose(player_elo, opponent_elo, player_k = 40) {
        const prob = this.calculateWinProbability(opponent_elo, player_elo);
        const new_elo = player_elo + (player_k * (0 - prob));
        return new_elo;
    }


    /**
     * @param {Number} player_elo
     * @param {Number} opponent_elo
     * @param {Number} player_k
     * @returns {Void}
     * @throws {CustomError}
     */
    getScorePlayerEgality(player_elo, opponent_elo, player_k = 40) {
        const prob = this.calculateWinProbability(opponent_elo, player_elo);
        const new_elo = player_elo + (player_k * (0.5 - prob));
        return new_elo;
    }


    /**
     * @param {Number} player_a
     * @param {Number} player_b
     * @param {Number} player_k
     * @returns {Void}
     * @throws {CustomError}
     */
    calculateWinProbability(player_a, player_b) {
        return (1.0 / (1.0 + Math.pow(10, ((player_a - player_b) / 400))));
    }
}

EloCalculator.instance = null;

module.exports = {
    EloCalculator,
};
