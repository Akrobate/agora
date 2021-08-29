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
    isConnected: (state) => state.is_connected,
    authenticationStatus: (state) => state.authentication_status,
    token: (state) => state.token,
    tokenData: (state) => state.token_data,
    isRenewingToken: (state) => state.is_renewing_token,
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
}

const mutations = {
    authentication_request(state) {
        state.authentication_status = 'loading'
    },
    set_is_renewing_token(state, value) {
        state.is_renewing_token = value
    },
    authentication_success(state, token) {
        state.authentication_status = 'success'
        state.is_connected = true
        state.token = token
        state.token_data = user_repository.decodeToken(token);
    },
    authentication_error(state) {
        state.authentication_status = 'error'
        state.is_connected = false
    },
    logout(state) {
        state.status = ''
        state.token = null
        state.is_connected = false
        state.token_data = {}
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}