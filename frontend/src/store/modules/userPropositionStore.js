import {
    user_proposition_repository,
} from '@/repositories'


const state = () => ({
    proposition_result_list: [],
})

const getters = {
    propositionResultList: (_state) => _state.proposition_result_list
}

const actions = {

    async init(_, { campaign_id }) {
        await user_proposition_repository.init(campaign_id)
    },

    async update(_, { campaign_id, proposition_id_list }) {
        await user_proposition_repository.update(campaign_id, proposition_id_list)
    },
    
    async loadPropositionResultList({ commit }, { campaign_id, user_id_list, algorithm }) {
        const {
            proposition_result_list,
        } = await user_proposition_repository.getPropositionResults(campaign_id, user_id_list, algorithm)
        commit('set_proposition_result_list', proposition_result_list)
        return proposition_result_list
    },

    async loadOwnPropositionResultList({ commit }, { campaign_id  }) {
        const {
            proposition_result_list,
        } = await user_proposition_repository.getOwnRanking(campaign_id)
        commit('set_proposition_result_list', proposition_result_list)
        return proposition_result_list
    }
}

const mutations = {
    set_proposition_result_list(_state, proposition_result_list) {
        _state.proposition_result_list = proposition_result_list  
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
