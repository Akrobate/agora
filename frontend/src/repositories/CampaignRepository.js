import axios from 'axios'
import configuration from '@/configurations/api'

class CampaignRepository {
   
    /**
     * @returns {CampaignRepository}
     */
    constructor() {
        this.ressource_url = `${configuration.url_api}/api/v1/campaigns`
    }
    

    /**
     * @param {Object} criteria 
     * @returns {Promise} 
     */
    async search(criteria) {
        const result = await axios.get(`${this.ressource_url}`, {
            params: criteria,
        });

        return result.data
    }


    /**
     * @param {Object} data 
     * @returns {Promise} 
     */
    async create(data) {
        const result = await axios.post(`${this.ressource_url}`, data)
        return result.data
    }


    /**
     * @param {Object} data 
     * @returns {Promise} 
     */
    async update(id, data) {
        const result = await axios.patch(`${this.ressource_url}/${id}`, data)
        return result.data
    }

    
    /**
     * @param {Object} data 
     * @returns {Promise} 
     */
    async read(id) {
        const result = await axios.get(`${this.ressource_url}/${id}`)
        return result.data
    }


    /**
     * @param {Object} data 
     * @returns {Promise} 
     */
    async delete(id) {
        const result = await axios.delete(`${this.ressource_url}/${id}`)
        return result.data
    }
}

const campaign_repository = new CampaignRepository()

export {
    campaign_repository,
}
