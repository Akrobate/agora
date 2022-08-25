import {
    user_repository,
} from '@/repositories'


const state = () => ({
    authentication_status: '',
    is_connected: user_repository.isValidLocalStorageToken(),
    token: user_repository.getTokenFromLocalStorageIfIsValid(),
    token_data: user_repository.isValidLocalStorageToken() ?
        user_repository.decodeToken(user_repository.getTokenFromLocalStorageIfIsValid()) : {},
    user: {},
    is_renewing_token: false,
})

const getters = {
    isConnected: (_state) => _state.is_connected,
    authenticationStatus: (_state) => _state.authentication_status,
    token: (_state) => _state.token,
    tokenData: (_state) => _state.token_data,
    isRenewingToken: (_state) => _state.is_renewing_token,
}

const actions = {
    
    login({ commit }, { email, password }) {
        return new Promise((resolve, reject) => {
            commit('authentication_request')
            return user_repository.login(email, password)
            .then((response) => {
                user_repository.setTokenLocalStorage(response.token)
                commit('authentication_success', response.token)
                return resolve(response)
            })
            .catch((error) => {
                commit('authentication_error')
                return reject(error)
            })
        })
    },
    async guestLogin({ commit }, { public_token }) {
        try {
            commit('authentication_request')
            const response = await user_repository.guestLogin(public_token)
            user_repository.setTokenLocalStorage(response.token)
            commit('authentication_success', response.token)
            return response
        } catch (error) {
            commit('authentication_error')
            throw error
        }
    },
    logout({ commit }) {
        commit('logout')
        user_repository.removeTokenLocalStorage()
    },
    setConnection({ commit }, { token }) {
        commit('authentication_success', token)
    },
    setIsRenewingToken({ commit }, value) {
        commit('set_is_renewing_token', value)
    },
    renewToken({ commit }) {
        console.log("renewToken store")
        commit('set_is_renewing_token', true)
        return new Promise((resolve, reject) => {
            commit('authentication_request')
            return user_repository.renewToken()
                .then((response) => {
                    console.log(response)
                    user_repository.setTokenLocalStorage(response.token)
                    commit('authentication_success', response.token)
                    commit('set_is_renewing_token', false)
                    return resolve(response)
                })
                .catch((error) => {
                    console.log("response", error)

                    commit('authentication_error')
                    commit('set_is_renewing_token', false)
                    return reject(error)
                })
        })
    },
    forgottenPasswordRequest(_, { email }) {
        return user_repository.forgottenPasswordRequest(email)
    },
    updateForgottenPassword(_, data) {
        const {
            forgotten_password_token,
            new_password,
            user_id,
        } = data
        return user_repository.updateForgottenPassword(user_id, {
            forgotten_password_token,
            new_password,
        })
    }
}

const mutations = {
    authentication_request(_state) {
        _state.authentication_status = 'loading'
    },
    set_is_renewing_token(_state, value) {
        _state.is_renewing_token = value
    },
    authentication_success(_state, token) {
        _state.authentication_status = 'success'
        _state.is_connected = true
        _state.token = token
        _state.token_data = user_repository.decodeToken(token);
    },
    authentication_error(_state) {
        _state.authentication_status = 'error'
        _state.is_connected = false
    },
    logout(_state) {
        _state.status = ''
        _state.token = null
        _state.is_connected = false
        _state.token_data = {}
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}