import {
    campaign_user_status_repository,
} from '@/repositories'

import {
    CAMPAIGN_USER_STATUS,
} from '@/constants'

const state = () => ({})

const getters = {}

const actions = {

    async getCampaignUserStatus(_, criteria) {
        const {
            campaign_id,
            status_id,
        } = criteria
        const {
            campaign_user_status_list,
        } = await campaign_user_status_repository.getStatus(campaign_id, status_id)
        return campaign_user_status_list
    },

    async setCampaignUserStatusInvited(_, { campaign_id }) {
        await campaign_user_status_repository.upsertStatus(campaign_id, CAMPAIGN_USER_STATUS.INVITED)
    },

    async setCampaignUserStatusResultSubmited(_, { campaign_id }) {
        await campaign_user_status_repository.upsertStatus(campaign_id, CAMPAIGN_USER_STATUS.RESULT_SUBMITED)
    },

    async setCampaignUserStatusStarted(_, { campaign_id }) {
        await campaign_user_status_repository.upsertStatus(campaign_id, CAMPAIGN_USER_STATUS.STARTED)
    },

    async checkAndsetCampaignUserStatusStarted({ dispatch }, { campaign_id }) {
        const campaign_user_status_list = await dispatch('getCampaignUserStatus', {
            campaign_id,
            status_id: CAMPAIGN_USER_STATUS.STARTED
        })
        if (campaign_user_status_list.length === 0) {
            await dispatch('setCampaignUserStatusStarted', { campaign_id })
        }
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
