import axios from 'axios'
import api_configuration from '@/configurations/api'
import jwt_decode from 'jwt-decode'

class UserRepository {

    async login(email, password) {
        const response = await axios.post(`${api_configuration.url_api}/api/v1/users/login`,
            {
                email,
                password,
            }
        )
        return response.data
    }

    async guestLogin(public_token) {
        const response = await axios.post(`${api_configuration.url_api}/api/v1/users/login/guest`,
            {
                public_token,
            }
        )
        return response.data
    }

    async renewToken() {
        const response = await axios.post(`${api_configuration.url_api}/api/v1/users/token/renew`)
        return response.data
    }

    async register({
        email,
        password,
        first_name,
        last_name
    }) {
        const response = await axios
            .post(`${api_configuration.url_api}/api/v1/users/register`,
                {
                    email,
                    password,
                    first_name,
                    last_name
                }
            )
        return response.data
    }

    async getUser(user_id) {
        const response = await axios.get(`${api_configuration.url_api}/api/v1/users/${user_id}`)
        return response.data
    }

    async updateUser(user_id, data) {
        const response = await axios.patch(`${api_configuration.url_api}/api/v1/users/${user_id}`, data)
        return response.data
    }

    getTokenLocalStorage() {
        return localStorage.token ? localStorage.token : null
    }

    setTokenLocalStorage(token) {
        localStorage.token = token
    }

    removeTokenLocalStorage() {
        localStorage.removeItem('token')
    }

    isValidLocalStorageToken() {
        const local_token = this.getTokenLocalStorage()
        return this.isValidToken(local_token)
    }

    getTokenFromLocalStorageIfIsValid() {
        const local_token = this.getTokenLocalStorage()
        if (this.isValidToken(local_token)) {
            return local_token
        }
        return null
    }

    isValidToken(token) {
        if (token == null || token == undefined || token === 'undefined')
            return false
        const now_timestamp = Math.floor(Date.now() / 1000)
        const decoded_token = this.decodeToken(token)
        return (decoded_token.exp > now_timestamp)
    }

    decodeToken(token) {
        return jwt_decode(token)
    }

}

const user_repository = new UserRepository()

export {
  user_repository,
}
