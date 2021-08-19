'use strict';


const {
    AbstractVotingAlgorithm,
} = require('./AbstractVotingAlgorithm');


class RelativeMajorityAlgorithm extends AbstractVotingAlgorithm {

    /**
     * @returns {RelativeMajorityAlgorithm}
     */
    static getInstance() {
        if (RelativeMajorityAlgorithm.instance === null) {
            RelativeMajorityAlgorithm.instance = new RelativeMajorityAlgorithm();
        }
        return RelativeMajorityAlgorithm.instance;
    }


    /**
     * @param {Array} possibilities_list
     * @param {Array} vote_list
     * @returns {Array}
     */
    process(possibilities_list, vote_list) {

        const vote_list_copy = this.copyList(vote_list);

        const result = [];
        for (let level = 0; level < possibilities_list.length; level++) {
            const level_position = this
                .getLevelElementFromAllLists(level, vote_list_copy);

            const level_position_sorted_list = this
                .countSortDescArrayOccurences(level_position);

            this.inPlaceSetToNullElementListInAllVoteList(
                vote_list_copy,
                level_position_sorted_list.map((item) => item.item)
            );

            level_position_sorted_list.forEach((item) => {
                result.push(item.item);
            });

            if (result.length === possibilities_list.length) {
                break;
            }
        }
        return result;
    }


    /**
     * @param {Array} list
     * @returns {Array<Object>}
     */
    countArrayOccurences(list) {
        return [...new Set(list)].map((item) => ({
            item,
            count: list
                .filter((element) => element === item)
                .length,
        }));
    }


    /**
     * @param {Array} list
     * @returns {Array<Object>}
     */
    countSortDescArrayOccurences(list) {
        return this.countArrayOccurences(list)
            .sort((a, b) => b.count - a.count);
    }


    /**
     * @param {Array} vote_list
     * @param {Array} element_list
     * @return {Array}
     */
    inPlaceSetToNullElementListInAllVoteList(vote_list, element_list) {
        element_list.forEach((element) => {
            vote_list.forEach((vote) => {
                const index = vote.indexOf(element);
                if (index >= 0) {
                    vote[index] = null;
                }
            });
        });
    }


    /**
     * @param {*} level
     * @param {*} vote_list
     * @returns {Array}
     */
    getLevelElementFromAllLists(level, vote_list) {
        const level_position = [];
        vote_list.forEach((vote) => {
            if (vote[level]) {
                level_position.push(vote[level]);
            }
        });
        return level_position;
    }
}

RelativeMajorityAlgorithm.instance = null;

module.exports = {
    RelativeMajorityAlgorithm,
};
