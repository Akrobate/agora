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
})
  
const getters = {
    isConnected: (state) => state.is_connected,
    authenticationStatus: (state) => state.authentication_status,
    token: (state) => state.token,
    tokenData: (state) => state.token_data,
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
    logout({ commit }) {
        commit('logout')
        user_repository.removeTokenLocalStorage()
    },
    setConnection({ commit }, { token }) {
        commit('authentication_success', token)
    },
}
  
  const mutations = {
    authentication_request(state) {
      state.authentication_status = 'loading'
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
    },
  }
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  }