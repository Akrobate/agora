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
        const {
            campaign_list,
        } = await campaign_repository.search(criteria)
        commit(`set_campaign_${list_to_update}_list`, campaign_list)
        return campaign_list
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
    async deleteProposition({ dispatch }, { campaign_id, id}) {
        const response = await proposition_repository.delete(campaign_id, id)
        await dispatch('loadPropositionList', { campaign_id })
        return response
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
    async searchCampaignUserList(_, { criteria = {}, campaign_id } ) {
        const {
            campaign_user_list
        } = await campaign_user_repository.search(campaign_id, criteria)
        return campaign_user_list
    },
    async loadCampaignUserList({ dispatch, commit }, { criteria = {}, campaign_id } ) {
        // const response = await campaign_user_repository.search(campaign_id, criteria)
        const campaign_user_list = await dispatch('searchCampaignUserList', { criteria, campaign_id })
        commit('set_campaign_user_list', campaign_user_list)
        return campaign_user_list
    },
    async clearCampaignUserList({ commit } ) {
        commit('set_empty_campaign_user_list')
    },

    async inviteCampaignUser({ dispatch }, { campaign_id, id }) {
        const response = await campaign_user_repository.invite(campaign_id, id)
        dispatch('loadCampaignUserList', { campaign_id });
        return response;
    }

}

const mutations = {

    set_campaign_draft_list(_state, campaign_list) {
        _state.campaign_draft_list = campaign_list;    
    },
    set_campaign_in_progress_list(_state, campaign_list) {
        _state.campaign_in_progress_list = campaign_list;    
    },
    set_campaign_finished_list(_state, campaign_list) {
        _state.campaign_finished_list = campaign_list;    
    },

    set_proposition_list(_state, proposition_list) {
        _state.proposition_list = proposition_list
    },
    set_empty_proposition_list(_state) {
        _state.proposition_list = []
    },

    set_campaign_user_list(_state, campaign_user_list) {
        _state.campaign_user_list = campaign_user_list
    },
    set_empty_campaign_user_list(_state) {
        _state.campaign_user_list = []
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
