import router from '@/router'
// import status_code from '@/constants/httpStatusCodes'
import store from '@/store'
import moment from 'moment'

const responseSuccess = function(response) {
    // console.log("From interceptor", response)
    return response
}

const responseError = function(error) {
    console.log(error);
    if (error.response.status === 401) {
        router.push({ name: 'login' })
    }
    return Promise.reject(error)
}


const requestAuthenticate = async (config) => {
    const token = store.getters['authentication_store/token']

    const is_connected = store.getters['authentication_store/isConnected']
    const token_data = store.getters['authentication_store/tokenData']
    
    // console.log(moment.unix(token_data.iat).toISOString());
    // console.log(moment.unix(token_data.exp).toISOString());
    // console.log((moment.unix(moment().unix()).toISOString()));
    
     // @todo: This mecanic could move to the store
    const is_renewing_token = store.getters['authentication_store/isRenewingToken']
    if (
        is_connected
        && (token_data.exp - moment().unix()) < (10 * 60)
        && is_renewing_token === false
        && token_data.exp - moment().unix() < token_data.exp
    ) {
        console.log("Refreshing token", (token_data.exp - moment().unix()) / 60);
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