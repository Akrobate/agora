import {
    user_proposition_repository,
} from '@/repositories'


const state = () => ({
})

const getters = {}

const actions = {

    async init(_, { campaign_id }) {
        await user_proposition_repository.init(campaign_id)
    },

    async update(_, { campaign_id, proposition_id_list }) {
        await user_proposition_repository.update(campaign_id, proposition_id_list)
    },
}

const mutations = {}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
