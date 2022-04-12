'use strict'

const state = () => ({
    is_loading: false,
    has_drawer: false,
    is_opened_drawer: false,
    app_version: process.env.VUE_APP_VERSION | "1.0.0",
})

const getters = {
    isLoading: (_state) => _state.is_loading,
    hasDrawer: (_state) => _state.has_drawer,
    isOpenedDrawer: (_state) => _state.is_opened_drawer,
    getAppVersion: (_state) => _state.app_version,
}

const actions = {
    setLoading({ commit }, is_loading) {
        return commit('set_loading', is_loading)
    },
    setOpenedDrawer({ commit }, is_open) {
        return commit('is_opened_drawer', is_open)
    },
    setHasDrawer({ commit }, has_drawer) {
        return commit('has_drawer', has_drawer)
    }
}

const mutations = {
    set_loading(_state, is_loading) {
        _state.is_loading = is_loading
    },
    has_drawer(_state, has_drawer) {
        _state.has_drawer = has_drawer
    },
    is_opened_drawer(_state, is_open) {
        _state.is_opened_drawer = is_open
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
