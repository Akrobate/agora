'use strict'

import {
    campaign_repository,
    proposition_repository,
    campaign_user_repository,
} from '@/repositories'
  
const state = () => ({
    campaign_draft_list: [],
    campaign_in_progress_list: [],
    campaign_finished_list: [],
    proposition_list: [],
    campaign_user_list: [],
})

const getters = {
    propositionList: (state) => state.proposition_list,
    campaignUserList: (state) => state.campaign_user_list,
    
    campaignDraftList: (state) => state.campaign_draft_list,
    campaignInProgressList: (state) => state.campaign_in_progress_list,
    campaignFinishedList: (state) => state.campaign_finished_list,
}

const actions = {

    async loadCampaigns({ commit }, { criteria = {}, list_to_update = 'draft' } = {}) {
        const response = await campaign_repository.search(criteria)
        commit(`set_campaign_${list_to_update}_list`, response.campaign_list)
        return response.campaign_list
    },
    async getCampaign(_, { campaign_id }) {
        return campaign_repository.read(campaign_id)
    },
    async createCampaign(_, data) {
        const response = await campaign_repository.create(data)
        return response
    },
    async updateCampaign({ dispatch }, { campaign_id, data }) {
        const response = await campaign_repository.update(campaign_id, data)
        await dispatch('loadCampaigns')
        return response
    },
    async deleteCampaign({ dispatch }, campaign_technical_name) {
        const response = await campaign_repository.delete(campaign_technical_name)
        await dispatch('loadCampaigns')
        return response
    },


    async createProposition(_, { campaign_id, data }) {
        const response = await proposition_repository.create(campaign_id, data)
        return response
    },
    async loadPropositionList({ commit }, { criteria = {}, campaign_id } ) {
        const response = await proposition_repository.search(campaign_id, criteria)
        commit('set_proposition_list', response.proposition_list)
        return response.campaign_list
    },
    async clearPropositionList({ commit } ) {
        commit('set_empty_proposition_list')
    },


    async getCampaignUser(_, { campaign_id, id }) {
        const campaign_user_list = await campaign_user_repository.search(campaign_id, {
            id_list: [id],
        })
        const [
            campaign_user,
        ] = campaign_user_list.campaign_user_list
        return campaign_user
    },
    async addCampaignUser(_, { campaign_id, data }) {
        const response = await campaign_user_repository.create(campaign_id, data)
        return response
    },
    async deleteCampaignUser(_, { campaign_id, id}) {
        const response = await campaign_user_repository.delete(campaign_id, id)
        return response
    },
    async updateCampaignUser(_, { campaign_id, id, data }) {
        const response = await campaign_user_repository.update(campaign_id, id, data)
        return response
    },
    async loadCampaignUserList({ commit }, { criteria = {}, campaign_id } ) {
        const response = await campaign_user_repository.search(campaign_id, criteria)
        commit('set_campaign_user_list', response.campaign_user_list)
        return response.campaign_list
    },
    async clearCampaignUserList({ commit } ) {
        commit('set_empty_campaign_user_list')
    },

}

const mutations = {

    set_campaign_draft_list(state, campaign_list) {
        state.campaign_draft_list = campaign_list;    
    },
    set_campaign_in_progress_list(state, campaign_list) {
        state.campaign_in_progress_list = campaign_list;    
    },
    set_campaign_finished_list(state, campaign_list) {
        state.campaign_finished_list = campaign_list;    
    },

    set_proposition_list(state, proposition_list) {
        state.proposition_list = proposition_list
    },
    set_empty_proposition_list(state) {
        state.proposition_list = []
    },

    set_campaign_user_list(state, campaign_user_list) {
        state.campaign_user_list = campaign_user_list
    },
    set_empty_campaign_user_list(state) {
        state.campaign_user_list = []
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
