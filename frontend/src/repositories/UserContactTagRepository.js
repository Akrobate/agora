import axios from 'axios'
import configuration from '@/configurations/api'

class UserContactTagRepository {
   
    /**
     * @returns {UserContactTagRepository}
     */
    constructor() {
        this.ressource_url = `${configuration.url_api}/api/v1/contacts`
    }

    /**
     * @param {Object} criteria
     * @returns {Promise}
     */
    async searchContacts(criteria) {
        const result = await axios.get(`${this.ressource_url}`, {
            params: criteria,
        });

        return result.data
    }

    /**
     * @param {Object} criteria
     * @returns {Promise}
     */
    async searchContactsTags(criteria) {
        const result = await axios.get(`${this.ressource_url}/tags`, {
            params: criteria,
        });
        return result.data
    }


    /**
     * @param {Object} criteria
     * @returns {Promise}
     */
    async createContactsTags(data) {
        const result = await axios.post(`${this.ressource_url}/tags`, data);
        return result.data
    }


    /**
     * @param {Number} id
     * @returns {Promise}
     */
    async getContactsTag(id) {
        const result = await axios.get(`${this.ressource_url}/tags/${id}`);
        return result.data
    }

    /**
     * @param {Number} id
     * @returns {Promise}
     */
    async deleteContactsTag(id) {
        const result = await axios.delete(`${this.ressource_url}/tags/${id}`);
        return result.data
    }


    /**
     * @param {Number} id
     * @param {Object} data
     * @returns {Promise}
     */
    async updateContactsTag(id, data) {
        const result = await axios.patch(`${this.ressource_url}/tags/${id}`, data)
        return result.data
    }

    /**
     * @param {*} data 
     * @returns 
     */
    async addContacts(data) {
        const result = await axios.patch(`${this.ressource_url}/`, data)
        return result.data
    }
}

const user_contact_tag_repository = new UserContactTagRepository()

export {
    user_contact_tag_repository,
}
