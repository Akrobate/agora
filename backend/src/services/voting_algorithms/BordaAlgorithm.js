'use strict';

const {
    AbstractVotingAlgorithm,
} = require('./AbstractVotingAlgorithm');


class BordaAlgorithm extends AbstractVotingAlgorithm {

    /**
     * @returns {BordaAlgorithm}
     */
    static getInstance() {
        if (BordaAlgorithm.instance === null) {
            BordaAlgorithm.instance = new BordaAlgorithm();
        }
        return BordaAlgorithm.instance;
    }


    /**
     * @param {Array} possibilities_list
     * @param {Array} vote_list
     * @returns {Array}
     */
    process(possibilities_list, vote_list) {

        const item_score = this.initAllItemScore(possibilities_list);

        vote_list.forEach((vote) => {
            const vote_item_score = this.getScoreForEachItem(vote);
            vote.forEach((item) => {
                item_score[item] += vote_item_score[item];
            });
        });

        const item_score_list = this
            .transformItemScoreObjectToArray(item_score, possibilities_list);

        return item_score_list.sort((a, b) => b.score - a.score)
            .map((item_score_elem) => item_score_elem.item);
    }


    /**
     * @param {Array} vote
     * @returns {Object}
     */
    getScoreForEachItem(vote) {
        const item_score = {};
        const total_votes = vote.length;
        for (let i = 0; i < total_votes; i++) {
            const score = total_votes - i;
            item_score[vote[i]] = score;
        }
        return item_score;
    }

    /**
     * @param {Array} possibilities_list
     * @returns {Object}
     */
    initAllItemScore(possibilities_list) {
        const item_score = {};
        possibilities_list.forEach((possibility) => {
            item_score[possibility] = 0;
        });
        return item_score;
    }


    /**
     * @param {Object} item_score
     * @param {Array} possibilities_list
     * @returns {Array}
     */
    transformItemScoreObjectToArray(item_score, possibilities_list) {
        return possibilities_list.map((item) => ({
            item,
            score: item_score[item],
        }));
    }

}

BordaAlgorithm.instance = null;

module.exports = {
    BordaAlgorithm,
};
