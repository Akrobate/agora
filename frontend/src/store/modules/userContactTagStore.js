import {
    user_contact_tag_store,
  } from '@/repositories'
  
  
  const state = () => ({
    user_contact_tag_list: []
  })
  
  const getters = {
    userContactTagList: (_state) => _state.user_contact_tag_list,
  }
  
  const actions = {
    async searchContacts(_, criteria) {
      const {
        contact_list,
      } = await user_contact_tag_store.searchContacts(criteria)
      return contact_list;
    },
    async loadContacts({ commit, dispatch }, { criteria = {} } = {}) {
      const user_contact_tag_list = await dispatch('searchContacts', criteria)
      commit('set_user_contact_tag_list', user_contact_tag_list)
      return user_contact_tag_list
  },
    async searcgTags(_, criteria) {
      const {
        tag_list,
      } = await user_contact_tag_store.searchContactsTags(criteria)
      return tag_list;
    },
    getContactsTag(_, {
      id,
    }) {
      return user_contact_tag_store.searchContactsTags(id)
    },
    updateContactsTag(_, {
      id,
      data,
    }) {
      return user_contact_tag_store.searchContactsTags(id, data)
    },
  }
  
  const mutations = {
    set_user_contact_tag_list(_state, user_contact_tag_list) {
      _state.user_contact_tag_list = user_contact_tag_list;    
    },
  }
  
  export default {
      namespaced: true,
      state,
      getters,
      actions,
      mutations
  }
  