'use strict';


class AbstractVotingAlgorithm {

    /**
     * @param {Array} vote_list
     * @returns {Array}
     */
    copyList(vote_list) {
        return vote_list
            .map((result) => [...result]);
    }
}

module.exports = {
    AbstractVotingAlgorithm,
};
