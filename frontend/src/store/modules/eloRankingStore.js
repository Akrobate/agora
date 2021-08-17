'use strict'

import {
    elo_ranking_repository,
} from '@/repositories'
  
const state = () => ({
    elo_inited: false,
    elo_proposition_ranking_list: [],
})

const getters = {
    eloPropositionRankingList: (state) => state.elo_proposition_ranking_list,
}

const actions = {

    async initEloData({ dispatch }, { campaign_id }) {
        const response = await elo_ranking_repository.init(campaign_id)
        dispatch('loadPropositionRankingList', { campaign_id })
        return response.campaign_list
    },

    async loadPropositionRankingList({ commit }, { campaign_id }) {
        const {
            user_proposition_elo_result_list
        } = await elo_ranking_repository.results(campaign_id)
        commit('set_elo_proposition_ranking_list', user_proposition_elo_result_list)
    },

    async writeDuelResult({ dispatch }, input) {
        const {
            campaign_id,
            proposition_id_1,
            proposition_id_2,
            winner,
        } = input;
        const response = await elo_ranking_repository.writeDuelResult(campaign_id, {
            proposition_id_1,
            proposition_id_2,
            winner,
        })
        dispatch('loadPropositionRankingList', { campaign_id })
        return response
    },

    async getRandomPropositions(_, { campaign_id }) {
        const {
            random_propositions,
        } = await elo_ranking_repository.getRandomPropositions(campaign_id)
        return random_propositions
    }

}

const mutations = {

    set_elo_proposition_ranking_list(state, elo_proposition_ranking_list) {
        state.elo_proposition_ranking_list = elo_proposition_ranking_list  
    },

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
