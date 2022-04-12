import router from '@/router'
import store from '@/store'
import moment from 'moment'
import http_status from 'http-status'


const responseSuccess = (response) => {
    return response
}

const responseError = (error) => {
    if (error.response.status === http_status.UNAUTHORIZED) {
        router.push({ name: 'login' })
    }
    return Promise.reject(error)
}


const requestAuthenticate = async (config) => {
    const token = store.getters['authentication_store/token']

    const is_connected = store.getters['authentication_store/isConnected']
    const token_data = store.getters['authentication_store/tokenData']

    // @todo: This mecanic could move to the store
    const is_renewing_token = store.getters['authentication_store/isRenewingToken']
    if (
        is_connected
        && (token_data.exp - moment().unix()) < (10 * 60)
        && is_renewing_token === false
        && token_data.exp - moment().unix() < token_data.exp
    ) {
        await store.dispatch('authentication_store/renewToken')
    }

    if (is_connected) {
        config.headers = {
            Authorization: `Bearer ${token}`
        }
    }
    return config
};

export {
    responseSuccess,
    responseError,
    requestAuthenticate,
}