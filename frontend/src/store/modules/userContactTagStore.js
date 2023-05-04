import {
    user_contact_tag_repository,
  } from '@/repositories'
  
  
  const state = () => ({
    user_contact_tag_list: [],
    user_contact_list: [],
  })
  
  const getters = {
    userContactTagList: (_state) => _state.user_contact_tag_list,
    userContactList: (_state) => _state.user_contact_list,
  }
  
  const actions = {
    async searchContacts(_, criteria) {
      const {
        contact_list,
      } = await user_contact_tag_repository.searchContacts(criteria)
      return contact_list;
    },
    async loadContacts({ commit, dispatch }, { criteria = {} } = {}) {
      const user_contact_list = await dispatch('searchContacts', criteria)
      commit('set_user_contact_list', user_contact_list)
      return user_contact_list
    },
    async searchContactTags(_, criteria) {
      const {
        tag_list,
      } = await user_contact_tag_repository.searchContactsTags(criteria)
      return tag_list;
    },
    async loadContactTags({ commit, dispatch }, { criteria = {} } = {}) {
      const user_contact_tag_list = await dispatch('searchContactTags', criteria)
      commit('set_user_contact_tag_list', user_contact_tag_list)
      return user_contact_tag_list
    },
    async searcgTags(_, criteria) {
      const {
        tag_list,
      } = await user_contact_tag_repository.searchContactsTags(criteria)
      return tag_list;
    },
    getContactsTag(_, {
      id,
    }) {
      return user_contact_tag_repository.searchContactsTags(id)
    },
    updateContactsTag(_, {
      id,
      data,
    }) {
      return user_contact_tag_repository.updateContactsTags(id, data)
    },
    createContactsTag(_, {
      data,
    }) {
      return user_contact_tag_repository.createContactsTags(data)
    },
  }
  
  const mutations = {
    set_user_contact_list(_state, user_contact_list) {
      _state.user_contact_list = user_contact_list;    
    },
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
  