import {
    user_contact_tag_store,
  } from '@/repositories'
  
  
  const state = () => ({})
  
  const getters = {}
  
  const actions = {
    async searchContacts(_, criteria) {
      const {
        contact_list,
      } = await user_contact_tag_store.searchContacts(criteria)
      return contact_list;
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
  
  const mutations = {}
  
  export default {
      namespaced: true,
      state,
      getters,
      actions,
      mutations
  }
  