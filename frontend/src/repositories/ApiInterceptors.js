import router from '@/router'
// import status_code from '@/constants/httpStatusCodes'
import store from '@/store'

const responseSuccess = function(response) {
    // console.log("From interceptor", response)
    return response
}

const responseError = function(error) {
    console.log("From interceptor error")
    if (error.status === 401) {
        router.push({ name: 'LoginPage' })
    }
    return Promise.reject(error)
}


const requestAuthenticate = (config) => {
    const token = store.getters['authentication_store/token']

    const is_connected = store.getters['authentication_store/isConnected']

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