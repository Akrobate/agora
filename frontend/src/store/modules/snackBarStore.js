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
    
    processDefaultsParams(_, input) {
        let default_params = {
            timeout: DEFAULT_TIMEOUT,
            has_close_button: false,
            color: DEFAULT_INFO_COLOR,
            text: '',
        }
        
        if (input.constructor == Object) {
            return {
                ...default_params,
                ...input,
            }
        }
        return {
            ...default_params,
            text: input,
        }
    },

    trigger({ commit }, data) {

        const {
            timeout,
            has_close_button,
            color,
            text,
        } = data

        commit('set_timeout', 0)
        commit('set_active', false)

        commit('set_text', text)
        commit('set_timeout', timeout)
        commit('set_has_close_button', has_close_button)
        commit('set_color', color)
        commit('set_active', true)
    },

    async triggerSuccess({ dispatch }, data) {
        const params = await dispatch('processDefaultsParams', data)
        dispatch('trigger', {
            ...params,
            color: DEFAULT_SUCCESS_COLOR,
        })
    },

    async triggerError({ dispatch }, data) {
        const params = await dispatch('processDefaultsParams', data)
        dispatch('trigger', {
            ...params,
            color: DEFAULT_ERROR_COLOR,
        })
    },

    async triggerInfo({ dispatch }, data) {
        const params = await dispatch('processDefaultsParams', data)
        dispatch('trigger', {
            ...params,
            color: DEFAULT_INFO_COLOR,
        })
    },

    async triggerWarning({ dispatch }, data) {
        const params = await dispatch('processDefaultsParams', data)
        dispatch('trigger', {
            ...params,
            color: DEFAULT_WARN_COLOR,
        })
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
