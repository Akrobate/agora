'use strict'

const DEFAULT_TIMEOUT = 2000

const DEFAULT_ERROR_COLOR = 'error'
const DEFAULT_SUCCESS_COLOR = 'success'
const DEFAULT_WARN_COLOR = 'warning'
const DEFAULT_INFO_COLOR = 'primary'


const state = () => ({
    color: '',
    active: false,
    text: '',
    has_close_button: '',
    timeout: 10000,
})

const getters = {
    color: (_state) => _state.color,
    active: (_state) => _state.active,
    text: (_state) => _state.text,
    hasCloseButton: (_state) => _state.has_close_button,
    timeout: (_state) => _state.timeout,
}

const actions = {
    triggerError({ commit }, data) {
        const {
            text,
            timeout,
            has_close_button,
        } = data
        commit('set_active', false)
        
        commit('set_text', text)
        commit('set_timeout', timeout ? timeout : DEFAULT_TIMEOUT)
        commit('set_has_close_button', has_close_button ? true : false)
        commit('set_color', DEFAULT_ERROR_COLOR)
        commit('set_active', true)
    },

    triggerInfo({ commit }, data) {
        const {
            text,
            timeout,
            has_close_button,
        } = data
        commit('set_active', false)
        
        commit('set_text', text)
        commit('set_timeout', timeout ? timeout : DEFAULT_TIMEOUT)
        commit('set_has_close_button', has_close_button ? true : false)
        commit('set_color', DEFAULT_INFO_COLOR)
        commit('set_active', true)
    },

    triggerSuccess({ commit }, data) {
        const {
            text,
            timeout,
            has_close_button,
        } = data
        commit('set_active', false)
        
        commit('set_text', text)
        commit('set_timeout', timeout ? timeout : DEFAULT_TIMEOUT)
        commit('set_has_close_button', has_close_button ? true : false)
        commit('set_color', DEFAULT_SUCCESS_COLOR)
        commit('set_active', true)
    },

    triggerWarning({ commit }, data) {
        const {
            text,
            timeout,
            has_close_button,
        } = data
        commit('set_active', false)
        
        commit('set_text', text)
        commit('set_timeout', timeout ? timeout : DEFAULT_TIMEOUT)
        commit('set_has_close_button', has_close_button ? true : false)
        commit('set_color', DEFAULT_WARN_COLOR)
        commit('set_active', true)
    },
}

const mutations = {
    set_active(_state, active) {
        _state.active = active
    },
    set_color(_state, color) {
        _state.color = color
    },
    set_text(_state, text) {
        _state.text = text
    },
    set_has_close_button(_state, has_close_button) {
        _state.has_close_button = has_close_button
    },
    set_timeout(_state, timeout) {
        _state.timeout = timeout
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
